import { SLIDES_DATA } from './data.js';

class PresentationApp {
    constructor() {
        this.currentIndex = 0;
        this.slides = SLIDES_DATA;
        this.expandedIndices = new Set();
        this.isMenuOpen = false;
        
        // Audio Player State
        this.audioPlayer = new Audio();
        this.currentTrackIdx = 0;
        this.isPlaying = false;

        // DOM Elements
        this.viewport = document.getElementById('slide-viewport');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentIndexEl = document.getElementById('current-index');
        this.totalSlidesEl = document.getElementById('total-slides');
        this.footerTitle = document.getElementById('footer-slide-title');
        this.progressDots = document.getElementById('progress-dots');
        this.lightbox = document.getElementById('lightbox');
        this.timerEl = document.getElementById('slide-timer');
        this.floatingMenu = document.getElementById('floating-menu');
        this.menuItemsContainer = document.getElementById('menu-items');

        this.init();
    }

    init() {
        this.totalSlidesEl.textContent = this.slides.length.toString().padStart(2, '0');
        this.renderProgressDots();
        this.renderFloatingMenu();
        this.renderSlide();
        this.setupEventListeners();
        this.startTimer();
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight': case ' ': this.navigate(1); break;
                case 'ArrowLeft': this.navigate(-1); break;
                case 'ArrowDown': this.toggleNextListItem(); break;
                case 'ArrowUp': this.togglePrevListItem(); break;
                case 'Escape': 
                    this.closeLightbox(); 
                    if (this.isMenuOpen) this.toggleMenu();
                    break;
            }
        });

        // Close menu on click outside
        window.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.floatingMenu.contains(e.target) && !e.target.closest('#menu-toggle')) {
                this.toggleMenu();
            }
        });

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.closest('button')) {
                this.closeLightbox();
            }
        });

        this.audioPlayer.addEventListener('timeupdate', () => this.updateAudioProgress());
        this.audioPlayer.addEventListener('ended', () => this.playNextTrack());
    }

    setTheme(themeName) {
        document.body.className = ''; // Reset
        if (themeName !== 'default') {
            document.body.classList.add(`theme-${themeName}`);
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.floatingMenu.classList.toggle('active', this.isMenuOpen);
    }

    renderFloatingMenu() {
        this.menuItemsContainer.innerHTML = '';
        this.slides.forEach((slide, idx) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-3 group';
            btn.onclick = () => {
                this.goToSlide(idx);
                this.toggleMenu();
            };

            btn.innerHTML = `
                <span class="text-[10px] font-mono text-gray-300 group-hover:text-black">${(idx + 1).toString().padStart(2, '0')}</span>
                <span class="text-xs font-bold truncate">${slide.title}</span>
            `;
            this.menuItemsContainer.appendChild(btn);
        });
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;
        
        if (this.slides[this.currentIndex].type === 'audio-player') {
            this.pauseTrack();
        }

        this.currentIndex = index;
        this.expandedIndices.clear();
        this.renderSlide();
        this.updateUI();
    }

    navigate(direction) {
        if (this.slides[this.currentIndex].type === 'audio-player') {
            this.pauseTrack();
        }

        this.currentIndex = (this.currentIndex + direction + this.slides.length) % this.slides.length;
        this.expandedIndices.clear();
        this.renderSlide();
        this.updateUI();
    }

    updateUI() {
        this.currentIndexEl.textContent = (this.currentIndex + 1).toString().padStart(2, '0');
        this.footerTitle.textContent = this.slides[this.currentIndex].title;
        
        const dots = this.progressDots.querySelectorAll('div');
        dots.forEach((dot, idx) => {
            dot.className = idx === this.currentIndex 
                ? 'h-1.5 w-8 bg-black rounded-full transition-all duration-300' 
                : 'h-1.5 w-1.5 bg-gray-200 rounded-full transition-all duration-300';
        });
    }

    renderProgressDots() {
        this.progressDots.innerHTML = '';
        this.slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = idx === 0 ? 'h-1.5 w-8 bg-black rounded-full' : 'h-1.5 w-1.5 bg-gray-200 rounded-full';
            this.progressDots.appendChild(dot);
        });
    }

    openLightbox(type, source) {
        const container = this.lightbox.querySelector('.lightbox-content');
        container.innerHTML = '';

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = source;
            img.className = 'max-w-full max-h-full rounded-lg shadow-2xl object-contain';
            container.appendChild(img);
        } else if (type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${source}?autoplay=1`;
            iframe.className = 'w-full aspect-video max-w-5xl rounded-2xl shadow-2xl';
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            container.appendChild(iframe);
        }

        this.lightbox.classList.add('active');
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        this.lightbox.querySelector('.lightbox-content').innerHTML = '';
    }

    toggleListItem(index) {
        if (this.expandedIndices.has(index)) {
            this.expandedIndices.delete(index);
        } else {
            this.expandedIndices.clear();
            this.expandedIndices.add(index);
        }
        this.renderSlideContent();
    }

    toggleNextListItem() {
        const slide = this.slides[this.currentIndex];
        if (slide.type !== 'list') return;
        
        let currentOpen = -1;
        if (this.expandedIndices.size > 0) {
            currentOpen = Array.from(this.expandedIndices)[0];
        }

        const nextIndex = currentOpen + 1;
        if (nextIndex < slide.list.length) {
            this.expandedIndices.clear();
            this.expandedIndices.add(nextIndex);
            this.renderSlideContent();
        }
    }

    togglePrevListItem() {
        const slide = this.slides[this.currentIndex];
        if (slide.type !== 'list') return;

        let currentOpen = -1;
        if (this.expandedIndices.size > 0) {
            currentOpen = Array.from(this.expandedIndices)[0];
        }

        const prevIndex = currentOpen - 1;
        if (prevIndex >= 0) {
            this.expandedIndices.clear();
            this.expandedIndices.add(prevIndex);
            this.renderSlideContent();
        } else if (currentOpen === 0) {
            this.expandedIndices.clear();
            this.renderSlideContent();
        }
    }

    async copyToClipboard(slideId, btnId) {
        const btn = document.getElementById(btnId);
        const slide = this.slides.find(s => s.id === slideId);
        if (!slide || !slide.code) return;

        const textToCopy = slide.code;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (!successful) throw new Error('execCommand failed');
            }
            
            const originalHtml = btn.innerHTML;
            const originalClasses = btn.className;
            
            btn.innerHTML = `
                <svg class="w-4 h-4 fill-current mr-2" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                Kopiert!
            `;
            btn.classList.remove('bg-black/50', 'hover:bg-black');
            btn.classList.add('bg-green-600');

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.className = originalClasses;
            }, 2000);
        } catch (err) {
            console.error('Kopieren fehlgeschlagen:', err);
            btn.innerText = "Fehler!";
            setTimeout(() => {
               this.renderSlideContent(); 
            }, 2000);
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    playTrack(idx = null) {
        const data = this.slides[this.currentIndex];
        if (idx !== null) {
            this.currentTrackIdx = idx;
            this.audioPlayer.src = data.tracks[idx].file;
        } else if (!this.audioPlayer.src) {
            this.audioPlayer.src = data.tracks[this.currentTrackIdx].file;
        }
        
        this.audioPlayer.play().catch(e => console.log("Audio play blocked", e));
        this.isPlaying = true;
        this.updateAudioUI();
    }

    pauseTrack() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updateAudioUI();
    }

    playNextTrack() {
        const data = this.slides[this.currentIndex];
        if (!data.tracks) return;
        this.currentTrackIdx = (this.currentTrackIdx + 1) % data.tracks.length;
        this.playTrack(this.currentTrackIdx);
    }

    playPrevTrack() {
        const data = this.slides[this.currentIndex];
        if (!data.tracks) return;
        this.currentTrackIdx = (this.currentTrackIdx - 1 + data.tracks.length) % data.tracks.length;
        this.playTrack(this.currentTrackIdx);
    }

    updateAudioProgress() {
        const progress = document.getElementById('audio-progress-bar');
        const currentTimeEl = document.getElementById('audio-current-time');
        const durationEl = document.getElementById('audio-duration');
        
        if (progress && this.audioPlayer.duration) {
            const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            progress.style.width = `${percent}%`;
            
            currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
            durationEl.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    updateAudioUI() {
        const playBtnIcon = document.getElementById('audio-play-icon');
        const trackItems = document.querySelectorAll('.track-item');
        
        if (playBtnIcon) {
            playBtnIcon.innerHTML = this.isPlaying 
                ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' 
                : '<path d="M8 5v14l11-7z"/>';
        }

        trackItems.forEach((item, idx) => {
            if (idx === this.currentTrackIdx) {
                item.classList.add('bg-black', 'text-white');
                item.classList.remove('bg-gray-50', 'text-gray-900');
            } else {
                item.classList.remove('bg-black', 'text-white');
                item.classList.add('bg-gray-50', 'text-gray-900');
            }
        });

        const activeTrackLabel = document.getElementById('active-track-label');
        if (activeTrackLabel) {
            const data = this.slides[this.currentIndex];
            activeTrackLabel.textContent = data.tracks[this.currentTrackIdx].title;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    renderSlide() {
        this.viewport.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'slide-container absolute inset-0 flex flex-col items-center justify-center opacity-0 scale-95';
        container.id = 'active-slide-container';
        this.viewport.appendChild(container);
        this.renderSlideContent();
        setTimeout(() => {
            container.classList.remove('opacity-0', 'scale-95');
            container.classList.add('opacity-100', 'scale-100');
        }, 50);
        this.updateUI();
    }

    renderSlideContent() {
        const container = document.getElementById('active-slide-container');
        if (!container) return;
        const data = this.slides[this.currentIndex];
        let html = '';

        switch(data.type) {
            case 'start':
                const hasBg = data.backgroundImage;
                html = `
                    ${hasBg ? `<div class="absolute inset-0 z-0">
                        <img src="${data.backgroundImage}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                    </div>` : ''}
                    <div class="relative z-10 text-center px-12">
                        <h1 class="text-7xl font-black mb-6 tracking-tighter ${hasBg ? 'text-white' : 'text-black'}">${data.title}</h1>
                        <div class="w-24 h-2 ${hasBg ? 'bg-white' : 'bg-black'} mx-auto mb-8 rounded-full"></div>
                        <p class="text-2xl italic font-light ${hasBg ? 'text-gray-200' : 'text-gray-500'}">${data.subtitle}</p>
                    </div>
                `;
                break;
            case 'table':
                html = `
                    <div class="w-full max-w-5xl px-12">
                        <h2 class="text-4xl font-bold mb-10 text-center">${data.title}</h2>
                        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-black text-white">
                                        ${data.headers.map(h => `<th class="px-8 py-6 text-sm uppercase tracking-widest font-bold">${h}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.rows.map((row, idx) => `
                                        <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100 transition-colors">
                                            ${row.map((cell, cidx) => `
                                                <td class="px-8 py-5 text-lg ${cidx === 0 ? 'font-bold text-black' : 'text-gray-600'}">
                                                    ${cell}
                                                </td>
                                            `).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                break;
            case 'code':
                html = `
                    <div class="w-full max-w-4xl px-12 flex flex-col items-center">
                        <h2 class="text-4xl font-bold mb-8 text-center">${data.title}</h2>
                        <div class="w-full bg-gray-900 rounded-[2rem] shadow-2xl p-8 relative group">
                            <div class="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
                                <div class="flex space-x-2">
                                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <span class="text-gray-500 font-mono text-xs uppercase tracking-widest">${data.language || 'Code'}</span>
                            </div>
                            <textarea readonly class="w-full h-64 bg-transparent text-blue-300 font-mono text-lg leading-relaxed resize-none outline-none overflow-auto custom-scrollbar">${data.code}</textarea>
                            <button id="copy-btn-${data.id}" onclick="window.app.copyToClipboard(${data.id}, 'copy-btn-${data.id}')" class="absolute bottom-6 right-6 bg-black/50 hover:bg-black text-white px-6 py-3 rounded-xl border border-white/10 flex items-center transition-all active:scale-95 shadow-lg group">
                                <svg class="w-4 h-4 fill-current mr-2 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                Code kopieren
                            </button>
                        </div>
                    </div>
                `;
                break;
            case 'audio-player':
                html = `
                    <div class="w-full max-w-5xl px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div class="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col items-center">
                            <div class="w-48 h-48 bg-gray-100 rounded-3xl mb-8 flex items-center justify-center shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                </svg>
                            </div>
                            <h3 id="active-track-label" class="text-2xl font-bold mb-1 text-center truncate w-full">${data.tracks[this.currentTrackIdx].title}</h3>
                            <p class="text-gray-400 mb-8 uppercase text-xs tracking-widest font-bold">${data.tracks[this.currentTrackIdx].artist}</p>
                            
                            <div class="w-full bg-gray-100 h-1.5 rounded-full mb-2 relative overflow-hidden">
                                <div id="audio-progress-bar" class="absolute top-0 left-0 h-full bg-black transition-all" style="width: 0%"></div>
                            </div>
                            <div class="w-full flex justify-between text-[10px] font-bold text-gray-400 mb-8">
                                <span id="audio-current-time">0:00</span>
                                <span id="audio-duration">0:00</span>
                            </div>

                            <div class="flex items-center space-x-8">
                                <button onclick="window.app.playPrevTrack()" class="p-4 hover:bg-gray-100 rounded-full transition-all">
                                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                                </button>
                                <button onclick="window.app.togglePlay()" class="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                                    <svg id="audio-play-icon" class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </button>
                                <button onclick="window.app.playNextTrack()" class="p-4 hover:bg-gray-100 rounded-full transition-all">
                                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z"/></svg>
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <h2 class="text-3xl font-bold mb-8">${data.title}</h2>
                            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-4">
                                ${data.tracks.map((track, idx) => `
                                    <div onclick="window.app.playTrack(${idx})" class="track-item group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${idx === this.currentTrackIdx ? 'bg-black text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}">
                                        <div class="flex items-center space-x-4">
                                            <span class="text-xs font-mono ${idx === this.currentTrackIdx ? 'text-white/50' : 'text-gray-300'}">${(idx + 1).toString().padStart(2, '0')}</span>
                                            <div>
                                                <p class="font-bold">${track.title}</p>
                                                <p class="text-[10px] uppercase tracking-widest ${idx === this.currentTrackIdx ? 'text-white/50' : 'text-gray-400'}">${track.artist}</p>
                                            </div>
                                        </div>
                                        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'text':
                html = `<div class="max-w-3xl px-12"><h2 class="text-5xl font-bold mb-10 border-l-8 border-black pl-8">${data.title}</h2><p class="text-2xl leading-relaxed text-gray-600">${data.content}</p></div>`;
                break;
            case 'list':
                html = `<div class="w-full max-w-4xl px-12"><h2 class="text-4xl font-bold mb-12 text-center">${data.title}</h2><div class="space-y-4">${data.list.map((item, idx) => `
                    <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="window.app.toggleListItem(${idx})">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4"><span class="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-xs font-bold">${idx + 1}</span><h3 class="text-xl font-bold">${item.label}</h3></div>
                            <div class="text-2xl font-mono text-gray-400">${this.expandedIndices.has(idx) ? '−' : '+'}</div>
                        </div>
                        <div class="list-item-content ${this.expandedIndices.has(idx) ? 'expanded' : ''}"><p class="mt-4 pt-4 border-t border-gray-50 text-gray-500 text-lg">${item.detail}</p></div>
                    </div>`).join('')}</div></div>`;
                break;
            case 'text-image':
                html = `
                    <div class="grid grid-cols-2 gap-16 items-center w-full max-w-6xl px-12">
                        <div>
                            <h2 class="text-5xl font-bold mb-8">${data.title}</h2>
                            <p class="text-2xl text-gray-600 leading-relaxed">${data.content}</p>
                        </div>
                        <div class="rounded-3xl overflow-hidden shadow-2xl relative group">
                            <img src="${data.image}" class="w-full h-auto cursor-zoom-in transition-transform duration-700 group-hover:scale-105" onclick="window.app.openLightbox('image', '${data.image}')">
                        </div>
                    </div>
                `;
                break;
            case 'image-text':
                html = `
                    <div class="grid grid-cols-2 gap-16 items-center w-full max-w-6xl px-12">
                        <div class="rounded-3xl overflow-hidden shadow-2xl relative group">
                            <img src="${data.image}" class="w-full h-auto cursor-zoom-in transition-transform duration-700 group-hover:scale-105" onclick="window.app.openLightbox('image', '${data.image}')">
                        </div>
                        <div>
                            <h2 class="text-5xl font-bold mb-8">${data.title}</h2>
                            <p class="text-2xl text-gray-600 leading-relaxed">${data.content}</p>
                        </div>
                    </div>
                `;
                break;
            case 'gallery':
                html = `<div class="w-full max-w-6xl overflow-y-auto max-h-[70vh] px-12">
                    <h2 class="text-4xl font-bold mb-10 text-center">${data.title}</h2>
                    <div class="grid grid-cols-3 gap-8">
                        ${data.gallery.map(item => `
                            <div class="flex flex-col group">
                                <div class="aspect-video rounded-xl overflow-hidden shadow-lg cursor-zoom-in relative">
                                    <img src="${item.url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onclick="window.app.openLightbox('image', '${item.url}')">
                                </div>
                                <p class="mt-3 text-sm font-medium text-gray-600 text-center">${item.caption}</p>
                            </div>`).join('')}
                    </div>
                </div>`;
                break;
            case 'video-grid':
                html = `<div class="w-full max-w-6xl overflow-y-auto max-h-[75vh] px-12">
                    <h2 class="text-4xl font-bold mb-10 text-center">${data.title}</h2>
                    <div class="grid grid-cols-3 gap-x-8 gap-y-12">
                        ${data.videos.map(vid => `
                            <div class="flex flex-col group">
                                <div class="aspect-video rounded-2xl overflow-hidden shadow-lg cursor-pointer relative bg-black" onclick="window.app.openLightbox('video', '${vid.videoId}')">
                                    <img src="${vid.thumb}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white fill-current" viewBox="0 0 20 20"><path d="M4.5 3.5v13l11-6.5-11-6.5z"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <p class="mt-4 text-sm font-bold text-gray-800 text-center uppercase tracking-wider">${vid.description}</p>
                            </div>`).join('')}
                    </div>
                </div>`;
                break;
            case 'end':
                html = `<div class="text-center bg-black text-white p-20 rounded-[4rem] shadow-2xl mx-12"><h1 class="text-6xl font-black mb-6">${data.title}</h1><p class="text-2xl text-gray-400">${data.subtitle}</p></div>`;
                break;
        }
        container.innerHTML = html;
        
        if (data.type === 'audio-player') {
            this.updateAudioUI();
        }
    }

    startTimer() {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            this.timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

window.app = new PresentationApp();
