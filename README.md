# 🎂 Birthday Website

A beautiful, animated birthday celebration website built with vanilla HTML, CSS & JavaScript.

## 🚀 How to Deploy on GitHub Pages

1. **Create a new GitHub repository** (e.g., `happy-birthday-[name]`)
2. **Push this folder** to the repository:
   ```bash
   cd birthday-website
   git init
   git add .
   git commit -m "Initial commit - Birthday website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## ✏️ How to Customize

All placeholder text is marked with `[square brackets]` in `index.html`. Replace them with your actual content:

| Placeholder | What to Replace With |
|---|---|
| `[Friend's Name]` | Your friend's name |
| `[Date, e.g. July 15, 2026]` | The actual birthday date |
| `[Your Name / Group Name]` | Who the site is from |
| `[Caption: Describe this memory]` | Photo captions |
| `[Quality 1-4]` | Qualities you love about them |
| `[Friend 1-4 Name]` | Names of people sending wishes |

### Adding Real Photos
Replace the `<div class="photo-placeholder">` blocks with `<img>` tags:
```html
<img src="photos/photo1.jpg" alt="A memory description" style="width:100%; aspect-ratio:4/3; object-fit:cover;">
```

## 🎨 Features
- Confetti burst animation on page load
- Floating emoji background bubbles
- Twinkling star effect
- 3D card tilt on hover
- Scroll-triggered reveal animations
- Fully responsive design
- Dark theme with purple-pink-gold gradient palette
