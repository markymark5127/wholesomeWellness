# Free Form Email Setup Guide - WholeSoul Wellness

Your form has been upgraded to use **Web3Forms** - a completely FREE service with better features than FormSubmit.co!

## What's New?

- File uploads up to **5MB** (was 2MB)
- **250 free submissions/month** (plenty for a small business)
- Better error handling and loading states
- No captcha required (optional)
- Works perfectly with GitHub Pages

---

## Setup Instructions (5 minutes)

### Step 1: Get Your Free Web3Forms Access Key

1. Go to **https://web3forms.com**
2. Click "Get Started Free" (no credit card needed)
3. Enter your email: **wholesoulyork@gmail.com**
4. You'll receive an access key (looks like: `abcd1234-5678-90ef-ghij-klmnopqrstuv`)

### Step 2: Add Your Access Key to the Form

1. Open `docs/legal-form.html` in your editor
2. Find line 34 (near the top of the form):
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
3. Replace `YOUR_ACCESS_KEY_HERE` with your actual access key
4. Save the file

### Step 3: Test Your Form

1. Push changes to GitHub
2. Wait 1-2 minutes for GitHub Pages to rebuild
3. Go to your form page: https://wholesoulyork.com/legal-form.html
4. Fill out and submit a test form
5. Check your email for the submission!

### Step 4: Done!

That's it! Your form now:
- Sends emails with file attachments to wholesoulyork@gmail.com
- Shows loading states ("Submitting...")
- Displays error messages if something goes wrong
- Redirects to thank-you page on success
- Works 100% free with no monthly fees

---

## Features Comparison

| Feature | FormSubmit.co | Web3Forms | This Setup |
|---------|---------------|-----------|------------|
| Monthly submissions | Unlimited | 250 | 250 (plenty!) |
| File upload size | 2MB | 5MB | 5MB |
| Setup complexity | Easy | Easy | Already done! |
| Cost | Free | Free | Free |
| Custom email templates | Limited | Yes | Enabled |
| API access | No | Yes | Yes |
| Spam protection | Basic | reCAPTCHA optional | Available |

---

## Alternative Free Services (If You Need More)

### If you need MORE than 250 submissions/month:

#### 1. **EmailJS** (200 emails/month)
- Free tier: 200 emails/month
- Setup: 10 minutes
- File uploads: Yes
- URL: https://www.emailjs.com

#### 2. **Formspree** (50 submissions/month)
- Free tier: 50/month
- Setup: 5 minutes
- File uploads: Yes (2MB)
- URL: https://formspree.io

#### 3. **GetForm** (100 submissions/month)
- Free tier: 100/month
- Setup: 5 minutes
- File uploads: Yes (10MB!)
- URL: https://getform.io

#### 4. **Basin** (100 submissions/month)
- Free tier: 100/month
- Setup: 5 minutes
- File uploads: Yes
- URL: https://usebasin.com

---

## Advanced: Custom Backend (Unlimited Free)

If you grow and need unlimited submissions, you can set up:

### Option A: Netlify (if you switch hosting)
- Deploy your site to Netlify instead of GitHub Pages
- Use Netlify Forms (100 free/month, then $19/mo for unlimited)
- No code changes needed

### Option B: Cloudflare Workers + Email
- Completely free for low-medium traffic
- Requires JavaScript backend code
- 100,000 requests/day free tier

### Option C: Vercel + Serverless Function
- Free for personal projects
- Easy deployment
- Serverless function to send emails

---

## Testing Your Form

### Test Checklist:
- [ ] Form submits successfully
- [ ] Email arrives at wholesoulyork@gmail.com
- [ ] File attachments are included in email
- [ ] All three signatures appear in email
- [ ] Form redirects to thank-you page
- [ ] Loading state shows "Submitting..."
- [ ] Error messages display if something fails

### Common Issues:

**Issue:** "Access key is invalid"
- **Fix:** Double-check you copied the full access key from Web3Forms

**Issue:** No email received
- **Fix:** Check spam folder, verify access key, check Web3Forms dashboard

**Issue:** File upload doesn't work
- **Fix:** Ensure file is under 5MB, check file format is allowed

**Issue:** Form doesn't redirect
- **Fix:** Check `thank-you.html` exists in same directory as form

---

## Web3Forms Dashboard Features

Once set up, you can:
- View all form submissions online
- Download submission data as CSV
- Add custom auto-responders
- Add spam filtering (reCAPTCHA)
- Add webhooks for automation
- View submission analytics

Access your dashboard at: https://web3forms.com/dashboard

---

## Security Notes

- Your access key is visible in HTML (this is safe for client-side forms)
- Web3Forms protects against spam with rate limiting
- You can enable reCAPTCHA for additional protection
- File uploads are scanned for malware
- All data is transmitted via HTTPS

---

## Support

**Web3Forms Support:**
- Documentation: https://docs.web3forms.com
- Contact: support@web3forms.com

**GitHub Pages (Hosting):**
- Your site updates automatically when you push to GitHub
- Changes may take 1-2 minutes to appear live
- Free forever for public repositories

---

## Summary

Your form now uses Web3Forms (100% free) and is deployed on GitHub Pages (also 100% free). Total cost: **$0/month** 🎉

Next steps:
1. Get your access key from web3forms.com
2. Replace `YOUR_ACCESS_KEY_HERE` in legal-form.html line 34
3. Commit and push to GitHub
4. Test your form!

Questions? Check the Web3Forms documentation or feel free to ask!
