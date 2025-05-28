# Soft Mobility Spacetime Maps

An interactive visualization tool that shows how travel times distort geographic space for **soft mobility modes** (pedestrian, runner, cyclist), creating "spacetime maps" where distances represent time rather than physical space.

## ✨ Features

- **🚶 Soft Mobility Focus** - Pedestrian, runner, and cyclist perspectives
- **🗺️ Interactive Spacetime Maps** with real-time mesh deformation
- **🏙️ Multi-City Comparison** - New York vs Daejeon prototype
- **📱 Mobile Optimized** with touch gestures and responsive design
- **⚡ High Performance** with adaptive quality and caching
- **🌍 Scalable Architecture** - Ready for global city expansion

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/spacetime-maps.git
cd spacetime-maps/frontend
npm install
npm run dev
# Open http://localhost:5173
```

**That's it!** Works completely standalone with pre-configured soft mobility data for New York and Daejeon.

## 🛠️ Technology Stack

**Frontend:** React 18.3.1 + Three.js 0.159.0 + TypeScript 5.8.3 + Vite 6.3.5  
**Backend:** Python 3.9+ + Google Maps API (optional, for data generation only)

## 🏙️ Available Cities & Modes

**New York City (USA)**

- 🚶 Pedestrian: 5 km/h average, walkability score 89/100
- 🏃 Runner: 12 km/h average, 25+ running routes
- 🚴 Cyclist: 20 km/h average, good bike infrastructure

**Daejeon (South Korea)**

- 🚶 Pedestrian: 5.2 km/h average, walkability score 78/100
- 🏃 Runner: 13 km/h average, 18+ running routes
- 🚴 Cyclist: 25 km/h average, excellent bike infrastructure

## 🎮 Usage

### Basic Controls

- **Mouse/Touch**: Drag to pan, scroll/pinch to zoom
- **Keyboard**: Space = play/pause, arrows = navigate
- **Mobile Gestures**: Swipe for navigation, double-tap for comparison

### Soft Mobility Comparison

1. Click "Compare Cities" button
2. Select mobility mode (pedestrian/runner/cyclist)
3. View side-by-side NY vs Daejeon analysis
4. Explore efficiency insights and recommendations

### Single City Exploration

1. Use menu to select city and mobility mode
2. Adjust timeness slider to see spacetime transformation
3. Observe how infrastructure affects mobility patterns

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide (frontend + backend)
- **[TODO.md](TODO.md)** - Development roadmap and features

## 📊 Performance

- **Bundle Size**: <1MB gzipped
- **Frame Rate**: 60 FPS desktop, 30+ FPS mobile
- **Initial Load**: <2s on modern devices
- **Soft Mobility Optimized**: Fast switching between mobility modes

## 🌍 Future Expansion

The current prototype focuses on New York vs Daejeon comparison, but the architecture is designed for global scalability:

- Easy addition of new cities
- Consistent soft mobility metrics
- Comparative analysis framework
- Mobile-first design for global accessibility

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for sustainable urban mobility using Three.js, React, and modern web technologies.

---

**🚶🏃🚴 Ready to explore soft mobility spacetime? Just run `npm run dev` and start mapping!**
