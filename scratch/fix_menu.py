import re

with open('d:/Projects/Sangam Mess/menu.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'<div class="menu-item menu-flip-card">\s*<div class="menu-flip-inner">\s*<div class="menu-flip-front">\s*<img src="(.*?)" alt="(.*?)">\s*(<h4>.*?</h4>)\s*</div>\s*<div class="menu-flip-back">\s*<h4>.*?</h4>\s*(<p>.*?</p>)\s*<div class="menu-item-bottom">\s*<div class="menu-item-price">(.*?)</div>\s*(<button.*?</button>)\s*</div>\s*</div>\s*</div>\s*</div>'

def replace_card(m):
    img_src = m.group(1)
    img_alt = m.group(2)
    h4 = m.group(3)
    p = m.group(4)
    price = m.group(5)
    btn = m.group(6)
    
    # Construct the new flat card layout
    new_card = f'''<div class="menu-item">
    <img src="{img_src}" alt="{img_alt}" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">
    <div class="menu-item-details">
        {h4}
        {p}
    </div>
    <div class="menu-item-bottom">
        <div class="menu-item-price">{price}</div>
        {btn}
    </div>
</div>'''
    return new_card

new_text, subs = re.subn(pattern, replace_card, text, flags=re.DOTALL)
print(f'Replaced {subs} cards!')

with open('d:/Projects/Sangam Mess/menu.html', 'w', encoding='utf-8') as f:
    f.write(new_text)
