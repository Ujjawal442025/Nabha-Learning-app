# Nabha Learning App - Punjab Government

**Rural Education Platform for Smart India Hackathon 2025**

A comprehensive learning platform designed specifically for rural areas in Punjab, optimized for low-end devices and offering full offline functionality.

## 🎯 Features

### 📱 **Optimized for Low-End Devices**
- Lightweight, fast-loading interface
- Minimal resource usage
- Progressive Web App (PWA) capabilities
- Works on 2G connections

### 🌐 **Multilingual Support**
- **Punjabi** (ਪੰਜਾਬੀ)
- **Hindi** (हिंदी)
- **English**
- Real-time language switching with persistent storage

### 👨‍🎓 **Student Features**
- **Dashboard**: Progress overview with statistics
- **Subjects**: Mathematics, Science, English, History, Computer Science, Geography
- **Video Lessons**: Downloadable for offline viewing
- **Assignments & Quizzes**: Interactive assessments with progress tracking
- **Translator**: English to Punjabi translation tool
- **Digital Literacy**: Interactive modules with GIFs and practice exercises
- **Offline Content**: Download videos/PDFs for offline access

### 👨‍🏫 **Teacher Features**
- **Classroom Management**: Create and manage virtual classrooms
- **Student Progress Tracking**: Monitor individual student performance
- **Content Upload**: Add new videos, PDFs, and assignments
- **Analytics Dashboard**: Track engagement and completion rates

### 🔄 **Offline Functionality**
- **Progressive Web App**: Installable on mobile devices
- **Service Worker**: Caches content for offline access
- **Background Sync**: Syncs data when connection returns
- **Local Storage**: Saves progress, translations, and downloads

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Web server (for development: Live Server, Python HTTP server, etc.)

### Installation

1. **Clone or Download** the project:
   ```bash
   git clone <repository-url>
   cd punjab-learning-platform
   ```

2. **Serve the files** using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using VS Code Live Server extension
   # Right-click index.html > "Open with Live Server"
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

4. **Install as PWA** (optional):
   - On mobile: Add to Home Screen
   - On desktop: Install app button in address bar

## 👥 Demo Credentials

### Students
- **Username**: `student123` **Password**: `demo@123`
- **Username**: `student2367` **Password**: `de@mo123`

### Teachers
- **Username**: `teacher1345` **Password**: `teach@123`

## 📁 Project Structure

```
punjab-learning-platform/
├── index.html              # Login page
├── student.html            # Student dashboard
├── teacher.html            # Teacher dashboard
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   ├── style.css          # Login page styles
│   ├── student.css        # Student dashboard styles
│   └── teacher.css        # Teacher dashboard styles
├── js/
│   ├── languages.js       # Multilingual support
│   ├── script.js          # Login functionality
│   ├── student.js         # Student dashboard logic
│   └── teacher.js         # Teacher dashboard logic
├── assets/
│   └── logo.svg           # App logo
├── components/
│   └── offline-page.html  # Offline fallback page
└── data/
    └── (quiz data, modules, etc.)
```

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design, Grid, Flexbox
- **JavaScript (ES6+)**: Modern JS features
- **Progressive Web App**: Service Worker, Manifest

### Offline & Performance
- **Service Worker**: Caching and offline functionality
- **Local Storage**: User data and preferences
- **IndexedDB**: Large data storage (for future enhancements)
- **Compression**: Optimized assets and code

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Support for high contrast mode
- **Multilingual**: Native language support

## 🎨 Design System

### Color Palette
- **Primary**: `#3338A0` (Deep Blue)
- **Secondary**: `#FEFBC7` (Light Yellow)
- **Background**: `#FAF7F3` (Warm White)
- **Card Background**: `#F0E4D3` (Light Beige)
- **Accent**: `#D9A299` (Soft Rose)

### Typography
- **Primary Font**: Arial, sans-serif
- **Display Font**: Lemon (for headings)
- **Punjabi Font**: Noto Sans Gurmukhi
- **Hindi Font**: Noto Sans Devanagari

## 📊 Performance Features

### Optimization Techniques
- **CSS Optimizations**: `will-change` properties, GPU acceleration
- **Image Optimization**: SVG icons, optimized images
- **Code Splitting**: Modular JavaScript
- **Caching Strategy**: Aggressive caching for static assets
- **Lazy Loading**: Images and content loaded on demand

### Low-End Device Support
- **Reduced Animations**: Disabled on low-performance devices
- **Memory Management**: Efficient DOM manipulation
- **Network Optimization**: Minimal external dependencies
- **Battery Saving**: Dark mode support for OLED screens

## 🔧 Customization

### Adding New Languages
1. Edit `js/languages.js`
2. Add translations to the `translations` object
3. Update language selection in `index.html`

### Adding New Subjects
1. Update subject cards in `student.html`
2. Add quiz data in `js/student.js`
3. Create corresponding PDF materials

### Customizing Theme
1. Update CSS custom properties in respective CSS files
2. Modify color variables at the top of each CSS file

## 📱 Mobile Features

### Progressive Web App
- **Installable**: Add to home screen
- **Offline First**: Works without internet
- **App-like**: Full screen experience
- **Push Notifications**: For new content (future enhancement)

### Responsive Design
- **Mobile First**: Designed for small screens
- **Touch Friendly**: Large tap targets
- **Gesture Support**: Swipe navigation (future enhancement)

## 🔒 Security & Privacy

### Data Protection
- **Local Storage**: All sensitive data stored locally
- **No External Dependencies**: Minimal external requests
- **Offline First**: Reduces data transmission
- **Session Management**: Secure session handling

## 🌟 Future Enhancements

### Planned Features
- **Voice Recognition**: Audio assignments and quizzes
- **AR/VR Support**: Immersive learning experiences
- **Peer Learning**: Student collaboration features
- **Advanced Analytics**: Detailed learning insights
- **Content Creator Tools**: For teachers to create custom content

## 🤝 Contributing

This project was created for the Smart India Hackathon 2025. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is developed for educational purposes and the Punjab Government's rural education initiative.

## 📧 Support

For technical support or questions about the platform, please refer to the demo credentials above to test all features.

---

**Made with ❤️ for Rural Punjab Education**
*Smart India Hackathon 2025*
