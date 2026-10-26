"""
Script to generate all standard Expo app icons from the official BPROTIC logo:
assets/expo.icon/Assets/logo-app-web.png
"""
import os
from PIL import Image

def generate_icons():
    src_path = os.path.join('assets', 'expo.icon', 'Assets', 'logo-app-web.png')
    out_dir = os.path.join('assets', 'images')
    os.makedirs(out_dir, exist_ok=True)

    if not os.path.exists(src_path):
        print(f"Error: Source image not found at {src_path}")
        return

    logo = Image.open(src_path).convert('RGBA')
    print(f"Loaded logo: {logo.size}")

    # 1. icon.png (1024 x 1024, iOS / General App Icon)
    icon = Image.new('RGBA', (1024, 1024), (9, 13, 22, 255)) # Dark theme background #090D16
    logo_1024 = logo.resize((920, 920), Image.Resampling.LANCZOS)
    icon.paste(logo_1024, ((1024 - 920) // 2, (1024 - 920) // 2), logo_1024)
    icon.save(os.path.join(out_dir, 'icon.png'), 'PNG')
    print("✓ Generated icon.png (1024x1024)")

    # 2. android-icon-foreground.png (512 x 512, transparent, 360x360 safe zone)
    fg = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    logo_fg = logo.resize((360, 360), Image.Resampling.LANCZOS)
    fg.paste(logo_fg, ((512 - 360) // 2, (512 - 360) // 2), logo_fg)
    fg.save(os.path.join(out_dir, 'android-icon-foreground.png'), 'PNG')
    print("✓ Generated android-icon-foreground.png (512x512)")

    # 3. android-icon-background.png (512 x 512)
    bg = Image.new('RGBA', (512, 512), (9, 13, 22, 255))
    bg.save(os.path.join(out_dir, 'android-icon-background.png'), 'PNG')
    print("✓ Generated android-icon-background.png (512x512)")

    # 4. android-icon-monochrome.png (512 x 512)
    mono = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    _, _, _, a = logo_fg.split()
    white = Image.new('RGBA', (360, 360), (255, 255, 255, 255))
    mono.paste(white, ((512 - 360) // 2, (512 - 360) // 2), a)
    mono.save(os.path.join(out_dir, 'android-icon-monochrome.png'), 'PNG')
    print("✓ Generated android-icon-monochrome.png (512x512)")

    # 5. splash-icon.png (512 x 512)
    splash = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    logo_splash = logo.resize((450, 450), Image.Resampling.LANCZOS)
    splash.paste(logo_splash, ((512 - 450) // 2, (512 - 450) // 2), logo_splash)
    splash.save(os.path.join(out_dir, 'splash-icon.png'), 'PNG')
    print("✓ Generated splash-icon.png (512x512)")

    # 6. favicon.png (48 x 48)
    favicon = logo.resize((48, 48), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(out_dir, 'favicon.png'), 'PNG')
    print("✓ Generated favicon.png (48x48)")

    # 7. app-logo.png (500 x 500, in-app branding)
    logo.save(os.path.join(out_dir, 'app-logo.png'), 'PNG')
    print("✓ Generated app-logo.png (500x500)")

if __name__ == '__main__':
    generate_icons()
