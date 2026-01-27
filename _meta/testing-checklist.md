# 🧪 Testing Checklist

**Run this checklist to verify everything works!**

---

## ✅ Dev Server Status

**Check:** Is the server running?
```bash
cd /Users/ariaxhan/Documents/Vaults/CodingVault/happyBibimbap/happy-bibimbap
npm start
```

Expected: Server starts on http://localhost:3000

---

## 🎨 3D Components Testing

### Home Page (http://localhost:3000)

**BibimbapBowl3D:**
- [ ] Bowl renders above welcome text
- [ ] Can drag to rotate the bowl
- [ ] Auto-rotates when not interacting
- [ ] Scroll wheel zooms in/out
- [ ] Looks good on mobile (check responsive view)

**MusicVisualizer3D:**
- [ ] Three visualizers appear (one per song)
- [ ] Click play on Song 1 → bars animate with music
- [ ] Click play on Song 2 → spheres pulse with music
- [ ] Click play on Song 3 → particles swirl with music
- [ ] Visualizers stop when audio stops
- [ ] No console errors

### About Me Page (http://localhost:3000/aboutme)

**FloatingIngredients:**
- [ ] Vegetables float in background
- [ ] Text is still readable (opacity 0.4)
- [ ] Smooth animation, no jank
- [ ] Works on mobile

### Introduction Page (http://localhost:3000/introduction)

**BibimbapBowl3D:**
- [ ] Small bowl renders (280px)
- [ ] Auto-rotates
- [ ] Complements existing images
- [ ] Doesn't distract from content

### Portfolio Page (http://localhost:3000/portfolio)

**FloatingIngredients:**
- [ ] Subtle background (opacity 0.3)
- [ ] Doesn't compete with portfolio images
- [ ] Smooth performance with existing animations

---

## 💬 Forum Testing

### Forum Home (http://localhost:3000/forum)

**Initial Load:**
- [ ] Forum page loads successfully
- [ ] "Start New Discussion" button visible
- [ ] Thread list appears (may be empty or have test data)
- [ ] No console errors

**Create Thread:**
- [ ] Click "Start New Discussion"
- [ ] Username prompt appears (first time only)
- [ ] Enter username → saves to localStorage
- [ ] Modal/form appears
- [ ] Fill in:
  - Title: "My favorite bibimbap ingredient"
  - Content: "I love the crunchy bean sprouts!"
- [ ] Click "Create Thread"
- [ ] New thread appears in list
- [ ] Thread shows author, time, 0 replies

### Thread Detail

**View Thread:**
- [ ] Click on your new thread
- [ ] Thread detail page loads
- [ ] Original post shows with badge
- [ ] Author avatar displays (first letter)
- [ ] Time displays correctly

**Reply to Thread:**
- [ ] Reply form appears at bottom
- [ ] Type: "I agree! Bean sprouts are the best!"
- [ ] Click "Post Reply"
- [ ] Reply appears immediately
- [ ] Reply count updates
- [ ] No console errors

**Like System:**
- [ ] Click heart icon on a post
- [ ] Like count increases
- [ ] Heart icon changes (fills/highlights)
- [ ] Click again → unlike
- [ ] Like count decreases
- [ ] Works on both original post and replies

**Back Navigation:**
- [ ] "← Back to Forum" button works
- [ ] Returns to thread list
- [ ] Thread now shows "1 reply" (or more)

---

## 🌐 Backend API Testing

**Test Endpoints Directly:**

```bash
# Get stats
curl https://happy-bibimbap-forum.ariaxhan.workers.dev/api/stats

# Get threads
curl https://happy-bibimbap-forum.ariaxhan.workers.dev/api/threads

# Get specific thread (use ID from threads list)
curl https://happy-bibimbap-forum.ariaxhan.workers.dev/api/threads/1
```

**Expected:**
- [ ] All endpoints return JSON
- [ ] No 500 errors
- [ ] Data matches what you see in UI

---

## 📱 Mobile Responsiveness

**Test on Mobile View (Chrome DevTools → Toggle Device Toolbar):**

**iPhone 12/13:**
- [ ] Home: 3D bowl fits screen, visualizers scale
- [ ] Forum: Thread list readable, buttons accessible
- [ ] Create thread: Modal fits screen
- [ ] Posts: Text wraps properly

**iPad:**
- [ ] Layout looks good at tablet size
- [ ] 3D elements don't overflow
- [ ] Forum UI uses space well

---

## 🚀 Performance Check

**Chrome DevTools → Performance:**
- [ ] 3D animations run at 60fps
- [ ] Music visualizers don't drop frames
- [ ] Forum interactions are snappy (<100ms)
- [ ] Page load time reasonable (<3s)

**Memory:**
- [ ] No memory leaks (check over 5 minutes)
- [ ] Memory usage stable with music playing

---

## 🐛 Console Errors

**Open Console (F12):**
- [ ] No red errors on any page
- [ ] Warnings about source maps are OK (mediapipe)
- [ ] No 404s for API calls
- [ ] No CORS errors

---

## 🎯 User Flow Test (End-to-End)

**Complete User Journey:**

1. Land on home page
   - [ ] See 3D bowl, rotate it
   - [ ] Scroll down to music
   - [ ] Play song, watch visualizer

2. Navigate to forum
   - [ ] Click "Forum" in navbar
   - [ ] See thread list

3. Create discussion
   - [ ] Click "Start New Discussion"
   - [ ] Create thread about favorite bibimbap recipe

4. Interact with thread
   - [ ] View thread
   - [ ] Add reply
   - [ ] Like your own post

5. Explore site
   - [ ] Visit About Me (see floating ingredients)
   - [ ] Visit Portfolio (see subtle background)
   - [ ] Visit Introduction (see small bowl)

**Total time:** Should feel smooth and engaging!

---

## ✅ Deployment Readiness

**Before Deploying to Production:**

- [ ] All tests above pass
- [ ] No console errors
- [ ] Mobile works perfectly
- [ ] Forum backend is live (already deployed!)
- [ ] Build succeeds: `npm run build`
- [ ] Production build works: `npm run preview` or serve build/

---

## 🎉 Success Criteria

**You'll know it's working when:**

1. **3D Magic** - Bowl rotates smoothly, visualizers dance with music
2. **Forum Alive** - Can create threads, reply, like posts
3. **Mobile Works** - Everything responsive and touch-friendly
4. **Zero Errors** - Clean console, no 500s
5. **Fast & Smooth** - 60fps animations, snappy interactions

---

## 🐛 Troubleshooting

**If something doesn't work:**

### 3D Components Not Rendering
- Check console for Three.js errors
- Verify WebGL is supported: http://get.webgl.org
- Try different browser (Chrome, Firefox, Safari)

### Forum API Errors
- Check network tab for failed requests
- Verify backend is live: `curl https://happy-bibimbap-forum.ariaxhan.workers.dev/api/stats`
- Check CORS headers in network response

### Music Visualizers Not Animating
- Ensure audio is actually playing
- Check browser allows Web Audio API
- Verify no errors in console related to AudioContext

### Build Errors
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf build/`
- Check Node version: `node -v` (should be 16+)

---

**Last Updated:** 2026-01-27
**Status:** Ready to test! 🚀
