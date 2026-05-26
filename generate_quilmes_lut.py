#!/usr/bin/env python3
"""
Quilmes Beer LUT Generator
Generates a cinematic 3D LUT inspired by Argentine beer commercials.
Style: golden hour, warm amber, cinematic contrast — medium intensity.
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
import sys

OUTPUT_DIR = "/mnt/user-data/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

LUT_SIZE = 33

# ─────────────────────────────────────────────
# 1. LUT CONSTRUCTION
# ─────────────────────────────────────────────

def apply_s_curve(x, strength=0.15):
    """Gentle S-curve: lifts mids contrast without crushing shadows."""
    # Symmetric S-curve via smoothstep blend
    s = x * x * (3.0 - 2.0 * x)
    return x + strength * (s - x)

def apply_lift_gamma_gain(x, lift=0.08, gamma=1.0, gain=0.96):
    """
    Lift: raises blacks (no crushed shadows).
    Gain: rolls off highlights to ~245/255 (filmic white point).
    """
    x_lifted = x * (1.0 - lift) + lift
    x_gained = np.power(np.clip(x_lifted, 0, 1), 1.0 / gamma) * gain
    return np.clip(x_gained, 0, 1)

def rgb_to_hsl_channel(r, g, b):
    """Per-pixel HSL — vectorised numpy."""
    cmax = np.maximum(np.maximum(r, g), b)
    cmin = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin

    # Lightness
    L = (cmax + cmin) / 2.0

    # Saturation
    S = np.where(delta == 0, 0.0, delta / (1.0 - np.abs(2 * L - 1) + 1e-8))

    # Hue (0-360)
    H = np.zeros_like(r)
    mask_r = (cmax == r) & (delta > 0)
    mask_g = (cmax == g) & (delta > 0)
    mask_b = (cmax == b) & (delta > 0)
    H[mask_r] = (60 * ((g[mask_r] - b[mask_r]) / delta[mask_r])) % 360
    H[mask_g] = (60 * ((b[mask_g] - r[mask_g]) / delta[mask_g]) + 120) % 360
    H[mask_b] = (60 * ((r[mask_b] - g[mask_b]) / delta[mask_b]) + 240) % 360

    return H, S, L

def hsl_to_rgb(H, S, L):
    """Vectorised HSL → RGB."""
    C = (1.0 - np.abs(2 * L - 1)) * S
    H_prime = H / 60.0
    X = C * (1.0 - np.abs(H_prime % 2 - 1))

    R1 = np.zeros_like(H)
    G1 = np.zeros_like(H)
    B1 = np.zeros_like(H)

    for i, (h_lo, h_hi, rv, gv, bv) in enumerate([
        (0, 1, C, X, 0), (1, 2, X, C, 0), (2, 3, 0, C, X),
        (3, 4, 0, X, C), (4, 5, X, 0, C), (5, 6, C, 0, X)
    ]):
        m = (H_prime >= h_lo) & (H_prime < h_hi)
        R1[m] = rv[m] if hasattr(rv, '__len__') else rv
        G1[m] = gv[m] if hasattr(gv, '__len__') else gv
        B1[m] = bv[m] if hasattr(bv, '__len__') else bv

    m_add = L - C / 2.0
    return np.clip(R1 + m_add, 0, 1), np.clip(G1 + m_add, 0, 1), np.clip(B1 + m_add, 0, 1)

def hsl_grade(r, g, b):
    """
    Selective HSL adjustments — the heart of the beer commercial look.
    Oranges/yellows +sat, greens desaturated→olive, blues toned down.
    """
    H, S, L = rgb_to_hsl_channel(r, g, b)

    # Hue ranges
    is_red      = ((H >= 345) | (H < 15))
    is_orange   = (H >= 15) & (H < 45)
    is_yellow   = (H >= 45) & (H < 70)
    is_green    = (H >= 70) & (H < 165)
    is_cyan     = (H >= 165) & (H < 195)
    is_blue     = (H >= 195) & (H < 255)
    is_magenta  = (H >= 285) & (H < 345)

    # ---- Saturation adjustments ----
    S_adj = S.copy()
    S_adj[is_red]     = np.clip(S[is_red]    * 1.10, 0, 1)     # +10% reds
    S_adj[is_orange]  = np.clip(S[is_orange] * 1.20, 0, 1)     # +20% oranges (cerveza!)
    S_adj[is_yellow]  = np.clip(S[is_yellow] * 1.20, 0, 1)     # +20% yellows
    S_adj[is_green]   = np.clip(S[is_green]  * 0.85, 0, 1)     # -15% greens
    S_adj[is_cyan]    = np.clip(S[is_cyan]   * 0.90, 0, 1)     # slight -sat cyan
    S_adj[is_blue]    = np.clip(S[is_blue]   * 0.80, 0, 1)     # -20% blues
    # magentas: neutral

    # ---- Luminance adjustments ----
    L_adj = L.copy()
    L_adj[is_orange]  = np.clip(L[is_orange] + 0.025, 0, 1)    # +5% lum oranges
    L_adj[is_yellow]  = np.clip(L[is_yellow] + 0.025, 0, 1)
    L_adj[is_green]   = np.clip(L[is_green]  - 0.01,  0, 1)    # slightly darker greens

    # ---- Hue shifts ----
    H_adj = H.copy()
    H_adj[is_green]   = (H[is_green] - 8) % 360      # shift green → yellow-olive
    H_adj[is_blue]    = (H[is_blue]  + 8) % 360      # shift blue → cyan (sky)
    H_adj[is_cyan]    = (H[is_cyan]  + 5) % 360      # nudge cyan slightly

    return hsl_to_rgb(H_adj, S_adj, L_adj)

def color_grade_shadows_mids_highs(r, g, b):
    """
    3-way color grading:
    - Shadows: teal/cyan push (subtle)
    - Midtones: warm amber/gold (simulated ~3500K)
    - Highlights: honey gold, no clipping
    """
    # Luminance mask (perceptual)
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b

    # Shadow mask: dark areas only
    shadow_mask = np.clip(1.0 - luma / 0.35, 0, 1) ** 1.5
    # Mid mask: bell curve around 0.45
    mid_mask = np.exp(-((luma - 0.45) ** 2) / (2 * 0.18 ** 2))
    # Highlight mask: bright areas
    highlight_mask = np.clip((luma - 0.65) / 0.35, 0, 1) ** 1.2

    # Shadow color push — teal/cyan, very subtle
    # teal push: +r nothing, -r tiny, +g tiny, +b small
    shadow_strength = 0.022
    r_shadow = r - shadow_strength * 0.6 * shadow_mask
    g_shadow = g + shadow_strength * 0.3 * shadow_mask
    b_shadow = b + shadow_strength * 1.0 * shadow_mask

    # Midtone warm amber push — simulate 3500K (more red/green, less blue)
    mid_strength = 0.045
    r_mid = r_shadow + mid_strength * 1.0 * mid_mask
    g_mid = g_shadow + mid_strength * 0.55 * mid_mask
    b_mid = b_shadow - mid_strength * 0.50 * mid_mask

    # Highlight honey gold — warm, slight desaturation of cool highlights
    hi_strength = 0.030
    r_hi = r_mid + hi_strength * 1.0 * highlight_mask
    g_hi = g_mid + hi_strength * 0.75 * highlight_mask
    b_hi = b_mid - hi_strength * 0.30 * highlight_mask

    return (np.clip(r_hi, 0, 1),
            np.clip(g_hi, 0, 1),
            np.clip(b_hi, 0, 1))

def protect_skin_tones(r_in, g_in, b_in, r_out, g_out, b_out):
    """
    Blend back toward original in skin-tone hue range to prevent
    the 'orange carrot' effect. Skin: hue ~5–25°, mid saturation.
    """
    H, S, L = rgb_to_hsl_channel(r_in, g_in, b_in)

    # Skin hue window: 5–30 degrees, mid S and L
    hue_weight   = np.exp(-((H - 17) ** 2) / (2 * 13 ** 2))  # bell at 17°
    sat_weight   = np.clip(S / 0.55, 0, 1) * np.clip(1.0 - (S - 0.55) / 0.30, 0, 1)
    luma_weight  = np.clip((L - 0.25) / 0.3, 0, 1) * np.clip(1.0 - (L - 0.75) / 0.2, 0, 1)

    skin_mask = (hue_weight * sat_weight * luma_weight * 0.45)  # max 45% pullback
    skin_mask = np.clip(skin_mask, 0, 0.45)

    r_prot = r_out * (1 - skin_mask) + r_in * skin_mask
    g_prot = g_out * (1 - skin_mask) + g_in * skin_mask
    b_prot = b_out * (1 - skin_mask) + b_in * skin_mask

    return np.clip(r_prot, 0, 1), np.clip(g_prot, 0, 1), np.clip(b_prot, 0, 1)

def build_lut():
    """Build the 3D LUT table (33^3 entries)."""
    print("[LUT] Building 33x33x33 LUT grid...")

    indices = np.linspace(0.0, 1.0, LUT_SIZE)
    # Shape: (33, 33, 33, 3) — B varies fastest per .cube spec
    B, G, R = np.meshgrid(indices, indices, indices, indexing='ij')
    # meshgrid with ij: axes are [B, G, R] in i,j,k — reorder
    # Actually for .cube: B=i, G=j, R=k when iterating r fastest
    # Let's build properly: r_idx fastest, then g, then b
    r_idx, g_idx, b_idx = np.meshgrid(indices, indices, indices, indexing='ij')
    # r_idx[i,j,k], g_idx[i,j,k], b_idx[i,j,k]
    # cube iterates: r fastest, g middle, b slowest
    # reshape for processing
    r_flat = r_idx.ravel()
    g_flat = g_idx.ravel()
    b_flat = b_idx.ravel()

    print("[LUT] Applying tonal curve (lift + S-curve + gain)...")
    # Tonal curve per channel
    r_t = apply_lift_gamma_gain(apply_s_curve(r_flat, 0.12), lift=0.08, gain=0.96)
    g_t = apply_lift_gamma_gain(apply_s_curve(g_flat, 0.12), lift=0.08, gain=0.96)
    b_t = apply_lift_gamma_gain(apply_s_curve(b_flat, 0.10), lift=0.075, gain=0.95)

    print("[LUT] Applying 3-way color grade (shadows/mids/highlights)...")
    r_c, g_c, b_c = color_grade_shadows_mids_highs(r_t, g_t, b_t)

    print("[LUT] Applying HSL selective adjustments...")
    r_h, g_h, b_h = hsl_grade(r_c, g_c, b_c)

    print("[LUT] Protecting skin tones...")
    r_final, g_final, b_final = protect_skin_tones(r_flat, g_flat, b_flat, r_h, g_h, b_h)

    # Stack into (N, 3) array
    lut_data = np.stack([r_final, g_final, b_final], axis=-1)
    # Reshape back: shape (33, 33, 33, 3) with [r_i, g_j, b_k]
    lut_3d = lut_data.reshape(LUT_SIZE, LUT_SIZE, LUT_SIZE, 3)

    return lut_3d

def write_cube_file(lut_3d, path):
    """Write .cube file — r varies fastest per spec."""
    print(f"[LUT] Writing {path}...")
    with open(path, 'w') as f:
        f.write('# Generated by Quilmes LUT Generator\n')
        f.write('# Style: Argentine beer commercial — golden hour cinematic look\n')
        f.write('# Designed for Rec.709 footage (phone cameras, consumer cameras)\n')
        f.write('# Apply at 80-90% opacity in CapCut / DaVinci Resolve / Premiere\n')
        f.write('#\n')
        f.write('# Color characteristics:\n')
        f.write('#   Shadows: subtle teal/cyan (cinematic depth)\n')
        f.write('#   Midtones: warm amber/gold (3500K simulation)\n')
        f.write('#   Highlights: honey gold roll-off (no clipping)\n')
        f.write('#   Skin tones: warm but protected from orange shift\n')
        f.write('#   Greens: desaturated to olive (summer foliage)\n')
        f.write('#   Blues: slightly cyan (sky recedes, gold dominates)\n')
        f.write('#\n')
        f.write('TITLE "Quilmes_CinematicBeer_v1"\n')
        f.write('LUT_3D_SIZE 33\n')
        f.write('DOMAIN_MIN 0.0 0.0 0.0\n')
        f.write('DOMAIN_MAX 1.0 1.0 1.0\n')
        f.write('\n')

        # Write: B varies slowest, G middle, R fastest
        count = 0
        for b_i in range(LUT_SIZE):
            for g_i in range(LUT_SIZE):
                for r_i in range(LUT_SIZE):
                    r_val, g_val, b_val = lut_3d[r_i, g_i, b_i]
                    f.write(f'{r_val:.6f} {g_val:.6f} {b_val:.6f}\n')
                    count += 1

    print(f"[LUT] Written {count} entries ({LUT_SIZE}^3 = {LUT_SIZE**3})")

# ─────────────────────────────────────────────
# 2. TRILINEAR INTERPOLATION FOR PREVIEW
# ─────────────────────────────────────────────

def apply_lut_trilinear(img_array, lut_3d):
    """Apply 3D LUT to image using trilinear interpolation."""
    print("[Preview] Applying LUT via trilinear interpolation...")
    h, w, _ = img_array.shape
    img_float = img_array.astype(np.float32) / 255.0

    r = img_float[:, :, 0]
    g = img_float[:, :, 1]
    b = img_float[:, :, 2]

    scale = LUT_SIZE - 1
    ri = np.clip(r * scale, 0, scale)
    gi = np.clip(g * scale, 0, scale)
    bi = np.clip(b * scale, 0, scale)

    r0 = np.floor(ri).astype(int)
    g0 = np.floor(gi).astype(int)
    b0 = np.floor(bi).astype(int)
    r1 = np.minimum(r0 + 1, LUT_SIZE - 1)
    g1 = np.minimum(g0 + 1, LUT_SIZE - 1)
    b1 = np.minimum(b0 + 1, LUT_SIZE - 1)

    rf = ri - r0
    gf = gi - g0
    bf = bi - b0

    # Trilinear: 8 corners
    def lut_lookup(ri_idx, gi_idx, bi_idx):
        return lut_3d[ri_idx, gi_idx, bi_idx]  # shape (H,W,3)

    c000 = lut_3d[r0, g0, b0]
    c100 = lut_3d[r1, g0, b0]
    c010 = lut_3d[r0, g1, b0]
    c110 = lut_3d[r1, g1, b0]
    c001 = lut_3d[r0, g0, b1]
    c101 = lut_3d[r1, g0, b1]
    c011 = lut_3d[r0, g1, b1]
    c111 = lut_3d[r1, g1, b1]

    rf = rf[:, :, np.newaxis]
    gf = gf[:, :, np.newaxis]
    bf = bf[:, :, np.newaxis]

    result = (c000 * (1-rf) * (1-gf) * (1-bf) +
              c100 * rf     * (1-gf) * (1-bf) +
              c010 * (1-rf) * gf     * (1-bf) +
              c110 * rf     * gf     * (1-bf) +
              c001 * (1-rf) * (1-gf) * bf     +
              c101 * rf     * (1-gf) * bf     +
              c011 * (1-rf) * gf     * bf     +
              c111 * rf     * gf     * bf)

    return np.clip(result * 255, 0, 255).astype(np.uint8)

# ─────────────────────────────────────────────
# 3. SYNTHETIC TEST IMAGE
# ─────────────────────────────────────────────

def create_test_image(width=960, height=540):
    """
    Generate synthetic test image with:
    - Sky gradient (top)
    - Warm light / golden bar light zone
    - Skin tone region
    - Amber/beer bottle surface
    - Green vegetation strip
    - Warm tungsten bokeh dots
    """
    print("[Preview] Generating synthetic test image...")
    img = np.zeros((height, width, 3), dtype=np.uint8)

    # Zone heights
    sky_h    = int(height * 0.30)
    golden_h = int(height * 0.15)
    skin_h   = int(height * 0.20)
    amber_h  = int(height * 0.15)
    green_h  = int(height * 0.12)
    bar_h    = height - sky_h - golden_h - skin_h - amber_h - green_h

    y = 0

    # --- SKY: blue-to-golden gradient (sunset) ---
    for row in range(sky_h):
        t = row / sky_h
        # Top: deep blue sky → bottom: warm golden horizon
        r = int(80  + t * (220 - 80))
        g = int(130 + t * (160 - 130))
        b = int(200 + t * (80  - 200))
        img[y + row, :] = [r, g, b]
    y += sky_h

    # --- GOLDEN HOUR LIGHT BAND ---
    for row in range(golden_h):
        t = row / golden_h
        r = int(240 + t * (255 - 240))
        g = int(180 + t * (210 - 180))
        b = int(80  + t * (120 - 80))
        img[y + row, :] = [r, g, b]
    y += golden_h

    # --- SKIN TONES: left = light skin, right = medium skin ---
    for row in range(skin_h):
        for col in range(width):
            t = col / width
            # Caucasian skin (~#D4956A) → olive/latin skin (~#C07850)
            r = int(212 + t * (192 - 212))
            g = int(149 + t * (120 - 149))
            b = int(106 + t * (80  - 106))
            # Subtle row gradient for dimension
            row_t = row / skin_h
            r = int(r * (1 - 0.05 * row_t))
            g = int(g * (1 - 0.05 * row_t))
            b = int(b * (1 - 0.05 * row_t))
            img[y + row, col] = [r, g, b]
    y += skin_h

    # --- AMBER/BEER BOTTLE surface ---
    for row in range(amber_h):
        for col in range(width):
            t_col = col / width
            t_row = row / amber_h
            # Dark amber left → bright honey gold center → deep amber right
            # Simulating condensation and backlight through glass
            center_dist = abs(t_col - 0.5) * 2  # 0 at center, 1 at edges
            brightness = 1.0 - center_dist * 0.5 + 0.2 * (1 - t_row)
            r = int(min(255, 200 * brightness))
            g = int(min(255, 140 * brightness))
            b = int(min(255, 30  * brightness))
            img[y + row, col] = [r, g, b]
    y += amber_h

    # --- GREEN VEGETATION: olive-summer green ---
    for row in range(green_h):
        for col in range(width):
            t = (col + row * 3) / (width + green_h * 3)
            r = int(60  + 40 * np.sin(t * 15))
            g = int(100 + 50 * np.cos(t * 12))
            b = int(30  + 20 * np.sin(t * 8))
            r = max(30, min(120, r))
            g = max(70, min(160, g))
            b = max(10, min(60,  b))
            img[y + row, col] = [r, g, b]
    y += green_h

    # --- BAR LIGHT: warm tungsten background with bokeh ---
    for row in range(bar_h):
        for col in range(width):
            # Dark warm ambient
            r = 45 + int(20 * (row / bar_h))
            g = 28 + int(10 * (row / bar_h))
            b = 12 + int(5  * (row / bar_h))
            img[y + row, col] = [r, g, b]

    # Add tungsten bokeh dots
    pil_img = Image.fromarray(img)
    draw = ImageDraw.Draw(pil_img)
    bokeh_centers = [
        (width * 0.12, y + bar_h * 0.4, 28, (255, 180, 60)),
        (width * 0.35, y + bar_h * 0.6, 18, (255, 200, 80)),
        (width * 0.58, y + bar_h * 0.3, 35, (255, 160, 40)),
        (width * 0.75, y + bar_h * 0.7, 22, (255, 190, 70)),
        (width * 0.90, y + bar_h * 0.5, 16, (255, 170, 50)),
    ]
    for cx, cy, radius, color in bokeh_centers:
        # Gaussian falloff simulation via concentric circles
        for layer in range(5):
            alpha = int(180 * (1 - layer / 5))
            r_layer = int(radius * (1 + layer * 0.6))
            overlay = Image.new('RGBA', pil_img.size, (0, 0, 0, 0))
            d = ImageDraw.Draw(overlay)
            d.ellipse(
                [cx - r_layer, cy - r_layer, cx + r_layer, cy + r_layer],
                fill=(*color, alpha // (layer + 1))
            )
            pil_img = Image.alpha_composite(pil_img.convert('RGBA'), overlay).convert('RGB')

    img = np.array(pil_img)
    return img

# ─────────────────────────────────────────────
# 4. PREVIEW COMPARISON IMAGE
# ─────────────────────────────────────────────

def add_label_bar(img_array, label, position='bottom'):
    """Add a label band on top or bottom of image."""
    h, w = img_array.shape[:2]
    bar_h = 42
    result = np.zeros((h + bar_h, w, 3), dtype=np.uint8)

    if position == 'bottom':
        result[:h] = img_array
        result[h:] = [20, 20, 20]
        pil = Image.fromarray(result)
        draw = ImageDraw.Draw(pil)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
        except Exception:
            font = ImageFont.load_default()
        # Center text
        bbox = draw.textbbox((0, 0), label, font=font)
        text_w = bbox[2] - bbox[0]
        x = (w - text_w) // 2
        y = h + (bar_h - 22) // 2
        draw.text((x, y), label, fill=(255, 255, 255), font=font)
        return np.array(pil)
    return result

def create_comparison_image(before, after, out_path):
    """Create side-by-side 1920x1080 comparison with divider line."""
    print("[Preview] Compositing comparison image...")
    target_h = 1080
    target_w_half = 960  # each side is 960px

    # Resize both halves
    before_pil = Image.fromarray(before).resize((target_w_half, target_h - 60), Image.LANCZOS)
    after_pil  = Image.fromarray(after).resize((target_w_half, target_h - 60), Image.LANCZOS)

    # Canvas
    canvas = Image.new('RGB', (1920, target_h), (10, 10, 10))

    canvas.paste(before_pil, (0, 0))
    canvas.paste(after_pil,  (target_w_half, 0))

    draw = ImageDraw.Draw(canvas)

    # Divider line
    draw.line([(target_w_half - 1, 0), (target_w_half - 1, target_h - 60)], fill=(255, 255, 255), width=3)
    draw.line([(target_w_half,     0), (target_w_half,     target_h - 60)], fill=(255, 255, 255), width=3)

    # Bottom label bar
    draw.rectangle([(0, target_h - 60), (1920, target_h)], fill=(15, 15, 15))

    try:
        font_big  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
        font_sub  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except Exception:
        font_big = font_sub = ImageFont.load_default()

    # LEFT label
    draw.text((40, target_h - 50), "ANTES", fill=(200, 200, 200), font=font_big)
    draw.text((40, target_h - 22), "Original Rec.709", fill=(120, 120, 120), font=font_sub)

    # RIGHT label
    after_label = "DESPUÉS — Quilmes Cinematic Beer LUT v1"
    draw.text((target_w_half + 40, target_h - 50), "DESPUÉS", fill=(244, 196, 120), font=font_big)
    draw.text((target_w_half + 40, target_h - 22), "Quilmes Cinematic Beer LUT v1  |  apply at 80-90%",
              fill=(180, 150, 80), font=font_sub)

    # Center watermark
    wm = "quilmes_look.cube"
    bbox = draw.textbbox((0, 0), wm, font=font_sub)
    wm_w = bbox[2] - bbox[0]
    draw.text(((1920 - wm_w) // 2, target_h - 28), wm, fill=(80, 80, 80), font=font_sub)

    canvas.save(out_path, 'PNG', quality=95)
    print(f"[Preview] Saved: {out_path}")

# ─────────────────────────────────────────────
# 5. CAPCUT INSTRUCTIONS
# ─────────────────────────────────────────────

CAPCUT_INSTRUCTIONS = """# Cómo usar el LUT en CapCut

## `quilmes_look.cube` — Look Cinematográfico Estilo Cerveza Argentina

---

## CapCut Desktop (Windows / Mac)

### Paso 1: Importar el LUT
1. Abrí CapCut Desktop y cargá tu proyecto de video
2. Seleccioná el clip al que querés aplicar el look
3. En el panel derecho, hacé clic en **"Ajustar"** (o "Adjust")
4. Buscá la sección **"LUT"** (debería estar visible en el panel de color)
5. Hacé clic en el ícono **"+"** o **"Importar LUT"**
6. Navegá hasta donde guardaste `quilmes_look.cube` y seleccionalo
7. El LUT aparecerá en tu biblioteca de LUTs personalizados

### Paso 2: Aplicar y ajustar opacidad
1. Hacé clic en el LUT `Quilmes_CinematicBeer_v1` para aplicarlo
2. Ajustá la **Intensidad/Opacidad al 80–85%** para un look natural
   - 100%: look cinematográfico intenso (ideal para contenido editorial)
   - 80–85%: **recomendado** — cinematográfico pero creíble
   - 60–70%: look sutil, casi invisible, para contenido everyday
3. Hacé clic fuera del panel para confirmar

### Paso 3: Ajustes previos recomendados (ANTES de aplicar el LUT)
Aplicá estos ajustes al clip **antes** de activar el LUT para mejores resultados:

| Ajuste | Valor sugerido | Por qué |
|--------|---------------|---------|
| **Balance de blancos** | 5000–5500K (o "Luz del día") | El LUT está calibrado para blancos neutros |
| **Exposición** | -0.2 a 0.0 EV | El LUT ya levanta las sombras, evitá sobreexponer |
| **Contraste** | -10 a 0 | El LUT agrega su propio contraste con S-curve |
| **Saturación** | -5 a 0 | El LUT satura naranjas/amarillos internamente |

---

## CapCut Móvil (iOS / Android)

### Pasos
1. Abrí CapCut en tu celular y cargá el proyecto
2. Tocá el clip en la línea de tiempo
3. Deslizá el menú inferior hasta encontrar **"Filtro"** → **"Mis filtros"**
4. Tocá el ícono **"Importar"** (nube con flecha hacia arriba, o carpeta)
5. Navegá hasta `quilmes_look.cube` en tu almacenamiento
   - En iPhone: `Archivos > En mi iPhone > CapCut`
   - En Android: `Almacenamiento interno > Downloads` (o donde lo hayas guardado)
6. Seleccioná el archivo `.cube` — CapCut lo importará automáticamente
7. Ajustá la **intensidad al 80%** con el slider

### ⚠️ Nota para móvil
La función de importación de LUTs personalizados puede requerir **CapCut versión 10.0 o superior**. Si no aparece la opción de importar, actualizá la app.

---

## Tips para el mejor resultado

### Cuándo brilla este LUT
- **Atardecer / Golden hour**: perfecto — el LUT amplifica el dorado natural
- **Juntadas y asados al aire libre**: funciona muy bien con luz de día
- **Interior con luz cálida** (lámparas, luces LED cálidas): excelente
- **Noche de bar**: ideal — las luces ámbar se vuelven cinematográficas

### Cuándo tener cuidado
- **Interior con luz fría/fluorescente**: puede virar demasiado. Corregí el balance de blancos primero
- **Videos muy subexpuestos**: levantá la exposición primero, luego aplicá el LUT
- **Cielos muy saturados (azul intenso)**: el LUT los desatura un poco — es intencional

### El truco del "look cervecero"
El LUT hace su magia en el **rango ámbar/dorado** (250–30° de hue).
Para maximizarlo:
1. Asegurate de tener **algo de calidez en escena** (luz de tarde, luces internas)
2. Si grabaste muy "frío", llevá el balance de blancos a 5500K antes del LUT
3. Los tonos de piel quedan levemente más cálidos pero sin volverse anaranjados — esto es intencional

---

## Usar en DaVinci Resolve (bonus)

1. Abrí el proyecto en DaVinci Resolve
2. En el nodo de color, hacé clic derecho → **"Add Node"** → **"Add LUT"**
3. Navegá hasta `quilmes_look.cube`
4. Ajustá la opacidad del nodo al 80–85% con el slider de mezcla

## Usar en Premiere Pro / After Effects (bonus)

1. En el clip, aplicá el efecto **"Lumetri Color"**
2. Expandí **"Input LUT"** o **"Creative"** → **"Look"**
3. Hacé clic en el desplegable → **"Browse..."**
4. Seleccioná `quilmes_look.cube`
5. Ajustá **"Intensity"** al 80–85%

---

*LUT generado para metraje Rec.709 estándar (celulares, cámaras de consumo)*
*Dominio: 0.0 – 1.0 | Tamaño: 33x33x33 | Formato: .cube v1.0*
"""

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  QUILMES CINEMATIC BEER LUT GENERATOR")
    print("  Style: Argentine beer commercial — golden hour look")
    print("=" * 60)
    print()

    # 1. Build LUT
    lut_3d = build_lut()
    cube_path = os.path.join(OUTPUT_DIR, "quilmes_look.cube")
    write_cube_file(lut_3d, cube_path)
    print(f"  ✓ LUT written: {cube_path}")
    print()

    # 2. Generate test image + apply LUT
    test_img = create_test_image(960, 540)
    graded_img = apply_lut_trilinear(test_img, lut_3d)

    preview_path = os.path.join(OUTPUT_DIR, "preview_comparison.png")
    create_comparison_image(test_img, graded_img, preview_path)
    print(f"  ✓ Preview written: {preview_path}")
    print()

    # 3. Write CapCut instructions
    md_path = os.path.join(OUTPUT_DIR, "INSTRUCCIONES_CAPCUT.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(CAPCUT_INSTRUCTIONS)
    print(f"  ✓ Instructions written: {md_path}")
    print()

    # Summary
    print("=" * 60)
    print("  GENERACIÓN COMPLETADA")
    print("=" * 60)
    print()
    print("Archivos generados en /mnt/user-data/outputs/:")
    for fname in ["quilmes_look.cube", "preview_comparison.png", "INSTRUCCIONES_CAPCUT.md"]:
        fpath = os.path.join(OUTPUT_DIR, fname)
        size = os.path.getsize(fpath)
        print(f"  {fname:<35} {size:>8,} bytes")
    print()
    print("USO RÁPIDO EN CAPCUT:")
    print("  1. Importá quilmes_look.cube desde Ajustar > LUT > Importar")
    print("  2. Ajustá la intensidad al 80-85%")
    print("  3. Antes de aplicar: corregí balance de blancos a ~5000K")
    print()
    print("El LUT funciona mejor en escenas con luz cálida natural")
    print("(golden hour, asados, bares con tungsteno, atardeceres).")
    print()
    print("Características del look:")
    print("  Sombras    → teal sutil (profundidad cinematográfica)")
    print("  Medios     → ámbar/dorado cálido (3500K simulado)")
    print("  Luces      → dorado miel con roll-off suave")
    print("  Piel       → levemente más cálida, protegida del naranja")
    print("  Verdes     → desaturados hacia oliva (vegetación de verano)")
    print("  Azules     → menos saturados, levemente más cian (cielo recede)")
    print("  Naranjas   → +20% saturación (el color de la cerveza)")

if __name__ == "__main__":
    main()
