# Testing Guide

## Manual Testing Checklist

### Setup
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run generate-icons`
- [ ] Run `npm run dev`

### Settings
- [ ] Navigate to Settings page
- [ ] Enter a test OpenAI API key
- [ ] Verify key is saved (refresh page, check key persists)
- [ ] Toggle show/hide key visibility
- [ ] Clear API key, verify it's removed

### Adding a Plant (Without AI)
- [ ] Click "Add Plant" button
- [ ] Fill in plant name (e.g., "Tomato")
- [ ] Fill in latin name (e.g., "Solanum lycopersicum")
- [ ] Upload a photo from device
- [ ] Verify photo preview shows correctly
- [ ] Click "Continue" without API key configured
- [ ] Verify plant is created and appears in list
- [ ] Verify thumbnail displays on home page

### Adding a Plant (With AI)
- [ ] Configure OpenAI API key in settings
- [ ] Click "Add Plant" button
- [ ] Fill in plant details and upload photo
- [ ] Click "Continue"
- [ ] Wait for AI to generate questions
- [ ] Answer questions in chat interface
- [ ] Click "Continue" after answering
- [ ] Verify AI generates care tasks
- [ ] Verify plant appears in list with photo

### Plant List
- [ ] Verify all plants display with thumbnails
- [ ] Test search functionality (search by name)
- [ ] Test search functionality (search by latin name)
- [ ] Click on a plant card
- [ ] Verify navigates to plant detail page

### Plant Detail Page
- [ ] Verify full-size photo displays
- [ ] Verify plant information displays correctly
- [ ] Verify tasks list displays
- [ ] Toggle task completion (check/uncheck)
- [ ] Add a new manual task
- [ ] Edit an existing task
- [ ] Delete a task (verify confirmation)
- [ ] Click "AI Generate" to regenerate tasks (with API key)
- [ ] Navigate back to home
- [ ] Delete plant (verify confirmation)

### Task Management
- [ ] Add task with description and date range
- [ ] Verify task appears in upcoming section
- [ ] Complete task, verify moves to completed section
- [ ] Uncomplete task, verify moves back to upcoming
- [ ] Edit task description and date
- [ ] Delete task

### PWA Functionality
- [ ] Open app in mobile browser
- [ ] Verify "Add to Home Screen" prompt appears
- [ ] Install app to home screen
- [ ] Launch app from home screen icon
- [ ] Verify app opens in standalone mode (no browser UI)
- [ ] Verify app icon displays correctly

### Offline Support
- [ ] Load app while online
- [ ] Turn off internet connection
- [ ] Refresh page, verify app still loads
- [ ] Navigate between pages
- [ ] Add/edit plants (should work)
- [ ] Try AI features (should show error)
- [ ] Turn internet back on
- [ ] Verify AI features work again

### Mobile Responsiveness
- [ ] Test on phone (portrait)
- [ ] Test on tablet (portrait and landscape)
- [ ] Verify bottom navigation is visible and accessible
- [ ] Verify all touch targets are at least 44x44px
- [ ] Test photo upload from camera
- [ ] Test photo upload from gallery
- [ ] Verify images resize properly

### Data Persistence
- [ ] Add several plants with photos
- [ ] Add tasks to plants
- [ ] Complete some tasks
- [ ] Close browser/app completely
- [ ] Reopen app
- [ ] Verify all data persists (plants, photos, tasks, settings)

### Image Handling
- [ ] Upload large image (5MB+)
- [ ] Verify compression works (check network tab or IndexedDB)
- [ ] Upload portrait photo, verify displays correctly
- [ ] Upload landscape photo, verify displays correctly
- [ ] Upload multiple photos for different plants
- [ ] Verify thumbnails load quickly on home page

### Error Handling
- [ ] Try AI features without API key configured
- [ ] Verify helpful error message
- [ ] Enter invalid API key
- [ ] Verify API error is shown
- [ ] Try to save task without description
- [ ] Verify validation works
- [ ] Fill out form partially and navigate away
- [ ] Verify data doesn't persist

### Performance
- [ ] Add 10+ plants with photos
- [ ] Verify home page loads quickly
- [ ] Verify scrolling is smooth
- [ ] Check IndexedDB usage (browser dev tools)
- [ ] Verify images are properly compressed

### Cross-Browser Testing
- [ ] Test in Chrome (mobile and desktop)
- [ ] Test in Safari (mobile and desktop)
- [ ] Test in Firefox
- [ ] Test in Edge

## Automated Testing (Future)
- Unit tests for stores
- Unit tests for services (OpenAI, image compression)
- Integration tests for IndexedDB operations
- E2E tests for critical user flows

## Known Limitations
- No cloud sync (data is local only)
- Requires OpenAI API key (user must provide their own)
- Photos stored in IndexedDB (limited by browser storage quota)
- AI features require internet connection

