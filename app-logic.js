/* Bunyi Kata application logic */
// --- 1. PANGKALAN DATA SESI (LIVE TRACKING) ---
        // Simpan rekod semua aktiviti untuk dipaparkan di Mod Guru
        var studentNames = ["Ali Bin Abu", "Siti Aminah", "Raju A/L Muthu", "Mei Ling"];
        function studentRecord() {
            return { belajar: { kad: false, cerita: false, surih: false, kotak: false }, latihan: { surihHuruf: false, padanan: false, dragdrop: false, belon: false, puzzle: false, carikata: false, tarikgaris: false, kuizaudio: false, susunkata: false }, scores: { surihHuruf: 0, padanan: 0, dragdrop: 0, belon: 0, puzzle: 0, carikata: 0, tarikgaris: 0, kuizaudio: 0, susunkata: 0, bonusHarian: 0 }, loginData: { lastLoginDate: null, consecutiveDays: 0, rewardClaimedDate: null }, avatar: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png', badges: [], newBadges: [], history: [] };
        }
        var savedStudentData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
        var studentData = Object.fromEntries(studentNames.map(name => [name, { ...studentRecord(), ...(savedStudentData[name] || {}) }]));
        Object.values(studentData).forEach(data => { const defaults = studentRecord(); data.belajar = { ...defaults.belajar, ...(data.belajar || {}) }; data.latihan = { ...defaults.latihan, ...(data.latihan || {}) }; data.scores = { ...defaults.scores, ...(data.scores || {}) }; data.loginData = { ...defaults.loginData, ...(data.loginData || {}) }; data.avatar = data.avatar || defaults.avatar; data.badges = Array.isArray(data.badges) ? data.badges : []; data.newBadges = Array.isArray(data.newBadges) ? data.newBadges : []; data.history = Array.isArray(data.history) ? data.history : []; });
        function saveStudentData() { localStorage.setItem('bunyiKataStudentData', JSON.stringify(studentData)); }

        // --- SISTEM AUTO-SAVE LATIHAN ---
        function getAutoSave(kunci) {
            if(!namaMuridAktif) return null;
            const data = JSON.parse(localStorage.getItem('bunyiKataAutoSave') || '{}');
            return data[namaMuridAktif] ? data[namaMuridAktif][kunci] : null;
        }
        function setAutoSave(kunci, nilai) {
            if(!namaMuridAktif) return;
            const data = JSON.parse(localStorage.getItem('bunyiKataAutoSave') || '{}');
            if(!data[namaMuridAktif]) data[namaMuridAktif] = {};
            data[namaMuridAktif][kunci] = nilai;
            localStorage.setItem('bunyiKataAutoSave', JSON.stringify(data));
        }
        function clearAutoSave(kunci) {
            if(!namaMuridAktif) return;
            const data = JSON.parse(localStorage.getItem('bunyiKataAutoSave') || '{}');
            if(data[namaMuridAktif]) delete data[namaMuridAktif][kunci];
            localStorage.setItem('bunyiKataAutoSave', JSON.stringify(data));
        }

        function updateProgressBar(id, percentage) {
            const pb = document.getElementById(id);
            if(pb) pb.style.width = Math.min(Math.max(percentage, 0), 100) + "%";
        }
        // --- AUDIO ENGINE ---
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioCtx;
        function playBubble() {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'sine'; const now = audioCtx.currentTime;
            osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
            gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        }
        
        function playOops() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'triangle'; const now = audioCtx.currentTime;
            osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        }

        function triggerErrorAnimation(el) {
            playOops();
            if (el) {
                el.classList.add('shake-error');
                setTimeout(() => el.classList.remove('shake-error'), 400);
            }
        }

        document.addEventListener('click', (e) => {
            if(e.target.closest('button, .island-node, .learning-card, .side-btn, select, .blank-slot')) playBubble();
        });

        function sebutAudio(teks) {
            playBubble();
            if('speechSynthesis' in window) {
                const s = new SpeechSynthesisUtterance(teks);
                s.lang = 'ms-MY'; s.rate = 0.85; window.speechSynthesis.speak(s);
            }
        }
        function sebutAudioHighlight(teks, id) {
            sebutAudio(teks);
            const el = document.getElementById(id);
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 1500);
        }

        // --- ANIMASI BERJAYA & BUNYI TADA ---
        function playTada() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const now = audioCtx.currentTime;
            
            // Chord pertama
            const osc1 = audioCtx.createOscillator(); const gain1 = audioCtx.createGain();
            const osc2 = audioCtx.createOscillator();
            const osc3 = audioCtx.createOscillator();
            
            osc1.type = 'triangle'; osc2.type = 'triangle'; osc3.type = 'triangle';
            osc1.frequency.setValueAtTime(400, now); // G4
            osc2.frequency.setValueAtTime(500, now); // B4
            osc3.frequency.setValueAtTime(600, now); // D5
            
            gain1.gain.setValueAtTime(0, now);
            gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
            gain1.gain.setValueAtTime(0.3, now + 0.15);
            gain1.gain.linearRampToValueAtTime(0, now + 0.2);
            
            osc1.connect(gain1); osc2.connect(gain1); osc3.connect(gain1); gain1.connect(audioCtx.destination);
            osc1.start(now); osc2.start(now); osc3.start(now);
            osc1.stop(now + 0.2); osc2.stop(now + 0.2); osc3.stop(now + 0.2);
            
            // Chord kedua (lebih tinggi)
            const osc4 = audioCtx.createOscillator(); const gain2 = audioCtx.createGain();
            const osc5 = audioCtx.createOscillator();
            const osc6 = audioCtx.createOscillator();
            
            osc4.type = 'triangle'; osc5.type = 'triangle'; osc6.type = 'triangle';
            osc4.frequency.setValueAtTime(500, now + 0.2); // B4
            osc5.frequency.setValueAtTime(600, now + 0.2); // D5
            osc6.frequency.setValueAtTime(800, now + 0.2); // G5
            
            gain2.gain.setValueAtTime(0, now + 0.2);
            gain2.gain.linearRampToValueAtTime(0.3, now + 0.25);
            gain2.gain.setValueAtTime(0.3, now + 0.6);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
            
            osc4.connect(gain2); osc5.connect(gain2); osc6.connect(gain2); gain2.connect(audioCtx.destination);
            osc4.start(now + 0.2); osc5.start(now + 0.2); osc6.start(now + 0.2);
            osc4.stop(now + 1.2); osc5.stop(now + 1.2); osc6.stop(now + 1.2);
        }

        function triggerSuccessAnimation(mesej, callback, retryCallback) {
            playTada();
            if (window.confetti) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    zIndex: 25000
                });
            }
            const celebration = document.getElementById('ganjaran-celebration');
            const textEl = document.getElementById('ganjaran-celebration-text');
            const retryBtn = document.getElementById('ganjaran-retry-btn');
            const continueBtn = document.getElementById('ganjaran-continue-btn');
            
            if(celebration) {
                if(textEl && mesej) textEl.innerText = mesej;
                else if (textEl) textEl.innerText = "Hebat! Tugasan selesai.";
                
                celebration.style.display = 'flex';
                
                if (continueBtn) {
                    continueBtn.onclick = () => {
                        celebration.style.display = 'none';
                        if (callback) callback();
                    };
                }
                
                if (retryBtn) {
                    if (retryCallback) {
                        retryBtn.style.display = 'block';
                        retryBtn.onclick = () => {
                            celebration.style.display = 'none';
                            retryCallback();
                        };
                    } else {
                        retryBtn.style.display = 'none';
                    }
                }
            } else {
                if(callback) setTimeout(callback, 3000);
            }
        }

        // --- SISTEM LOG MASUK & PENJEJAKAN ---
        var modSemasa = 'belajar'; 
        var namaMuridAktif = "";
        var modGuruAktif = false;

        
        function bukaSidePanel() {
            const panel = document.getElementById('murid-side-panel-overlay');
            if(panel) panel.classList.add('active');
            
            // update avatar and name in side panel
            if(window.namaMuridAktif) {
                if(document.querySelector('.murid-info-name')) document.querySelector('.murid-info-name').innerText = window.namaMuridAktif;
                document.querySelector('.murid-info-avatar').className = "fa-solid murid-info-avatar " + window.selectedAvatarIcon;
            }
        }
        
        function tutupSidePanel() {
            const panel = document.getElementById('murid-side-panel-overlay');
            if(panel) panel.classList.remove('active');
        }

        const SCREEN_NAMES_MAP = {
            'login-screen': 'Log Masuk',
            'main-menu-screen': 'Menu Utama',
            'map-screen': 'Peta Pembelajaran',
            'murid-menu-belajar': 'Mod Belajar',
            'murid-menu-latihan': 'Mod Latihan',
            'view-learn-1': 'Belajar Huruf Vokal',
            'view-learn-2': 'Belajar Huruf Konsonan',
            'view-learn-4': 'Belajar Suku Kata KV',
            'view-latihan-1': 'Latihan Padanan Gambar',
            'view-latihan-2': 'Latihan Drag & Drop',
            'view-latihan-3': 'Latihan Belon BOT',
            'view-latihan-4': 'Latihan Susun Puzzle',
            'view-latihan-5': 'Latihan Surih Huruf',
            'view-latihan-carikata': 'Latihan Cari Kata',
            'view-latihan-tarikgaris': 'Latihan Tarik Garis',
            'view-latihan-kuizaudio': 'Latihan Kuiz Audio',
            'view-latihan-susunkata': 'Latihan Susun Kata',
            'leaderboard-screen': 'Papan Kedudukan',
            'prestasi-screen': 'Laporan Prestasi',
            'profile-screen': 'Profil Murid',
            'lencana-screen': 'Koleksi Lencana',
            'guru-senarai-perkataan': 'Senarai Perkataan (Cikgu)',
            'guru-dashboard': 'Dashboard Cikgu',
            'view-surih-huruf': 'Aktiviti Surih Huruf',
            'view-tanduk-kata': 'Permainan Tanduk Kata',
            'view-perpustakaan': 'Perpustakaan Mini',
            'view-cabaran-suku-kata': 'Cabaran Suku Kata',
            'view-vr-abc': 'Dunia VR & AR',
            'view-belajar-huruf': 'Mod Belajar Huruf',
            'view-belajar-sukukata': 'Mod Belajar Suku Kata',
            'view-belajar-bacaan': 'Mod Belajar Bacaan Bergred'
        };

        function paparSkrin(screenId, skipHash) {
            if (!screenId) return;
            const sasaran = document.getElementById(screenId);
            if (!sasaran) return;

            if (typeof flashcardAttentionTimer !== 'undefined') {
                clearInterval(flashcardAttentionTimer);
            }
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            sasaran.classList.add('active');

            // Kemaskini Tajuk Halaman & URL Hash untuk PWA & Navigasi
            const tajukSkrin = SCREEN_NAMES_MAP[screenId] || 'Bunyi Kata';
            document.title = `${tajukSkrin} | Bunyi Kata`;

            if (!skipHash) {
                if (window.location.hash !== '#' + screenId) {
                    history.pushState({ screenId: screenId }, '', '#' + screenId);
                }
            }

            if (screenId.startsWith('guru-') || screenId === 'guru-dashboard') {
                document.body.classList.add('teacher-mode');
                window.modGuruAktif = true;
            } else if (screenId === 'login-screen' || screenId === 'main-menu-screen') {
                if (screenId === 'login-screen') {
                    document.body.classList.remove('teacher-mode');
                    window.modGuruAktif = false;
                }
            }
            
            // Jika buka dashboard guru, render jadual
            if(screenId === 'guru-dashboard') {
                renderTeacherTable();
            }
            if(screenId === 'guru-senarai-perkataan') {
                if (window.renderGuruSenaraiPerkataan) window.renderGuruSenaraiPerkataan('suku_kata_kv');
            }
            if(screenId === 'murid-menu-latihan') renderLatihanLocks();
            if(screenId === 'profile-screen' || screenId === 'prestasi-screen') renderProfile();
            if(screenId === 'leaderboard-screen') renderLeaderboard();
            
            // Stop camera streams if navigating away from VR/AR
            if (screenId !== 'view-vr-abc' && screenId !== 'view-ar-abc') {
                ['vr-camera-bg', 'ar-camera-bg'].forEach(id => {
                    const video = document.getElementById(id);
                    if (video && video.srcObject) {
                        video.srcObject.getTracks().forEach(track => track.stop());
                        video.srcObject = null;
                    }
                });
                
                const vrContainer = document.getElementById('vr-container');
                if (vrContainer) vrContainer.innerHTML = '';
                const arContainer = document.getElementById('ar-container');
                if (arContainer) arContainer.innerHTML = '';

            }
        }

        function mengendaliNavigasiURL() {
            const hash = window.location.hash.replace('#', '');
            if (hash && document.getElementById(hash)) {
                paparSkrin(hash, true);
            }
        }

        window.addEventListener('popstate', mengendaliNavigasiURL);
        window.addEventListener('hashchange', mengendaliNavigasiURL);

        function masukModGuru() {
            modGuruAktif = true;
            document.body.classList.add('teacher-mode');
            paparSkrin('guru-dashboard');
        }

        function keluarModGuru() {
            modGuruAktif = false;
            document.body.classList.remove('teacher-mode');
            paparSkrin('login-screen');
        }

        function bukaAksesGuru(mod) {
            modSemasa = mod;
            paparSkrin(mod === 'belajar' ? 'murid-menu-belajar' : 'murid-menu-latihan');
        }

        function bukaModalAksesGuru() {
            document.getElementById('modal-akses-guru').style.display = 'flex';
        }

        function tutupModalAksesGuru() {
            document.getElementById('modal-akses-guru').style.display = 'none';
        }

        function muatTurunCSV() {
            const headers = ['Nama Murid', 'Jumlah Markah', 'Lencana', 'ABC', 'Vokal', 'Konsonan', 'KV', 'KVK', 'KV+KV', 'V+KVK', 'V+KV', 'KV+KV+KV'];
            const rows = Object.entries(studentData).map(([nama, data]) => {
                const b = data.belajar || {};
                const l = data.latihan || {};
                const s = data.scores || {};
                return [
                nama, jumlahMarkah(data), (data.badges || []).length,
                `${l.surihHuruf ? 'Selesai' : 'Belum'} (${s.surihHuruf || 0}/10)`,
                `${l.padanan ? 'Selesai' : 'Belum'} (${s.padanan || 0}/10)`,
                `${l.dragdrop ? 'Selesai' : 'Belum'} (${s.dragdrop || 0}/10)`,
                `${l.belon ? 'Selesai' : 'Belum'} (${s.belon || 0}/10)`,
                `${l.puzzle ? 'Selesai' : 'Belum'} (${s.puzzle || 0}/10)`,
                `${l.carikata ? 'Selesai' : 'Belum'} (${s.carikata || 0}/10)`,
                `${l.tarikgaris ? 'Selesai' : 'Belum'} (${s.tarikgaris || 0}/10)`,
                `${l.kuizaudio ? 'Selesai' : 'Belum'} (${s.kuizaudio || 0}/10)`,
                `${l.susunkata ? 'Selesai' : 'Belum'} (${s.susunkata || 0}/10)`
                ];
            });
            const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
            const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'rekod-murid-bunyi-kata.csv';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }

        function cetakLaporanPDF() {
            window.print();
        }

        
        var selectedAvatarIcon = 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
        window.onStudentSelect = function(nama) {
            if (studentData[nama] && studentData[nama].avatar) {
                const icon = studentData[nama].avatar;
                const opt = Array.from(document.querySelectorAll('.avatar-option')).find(el => el.innerHTML.includes(icon));
                if(opt) {
                    window.selectAvatar(icon, opt);
                }
            }
        };
        window.selectAvatar = function(icon, element) {
            selectedAvatarIcon = icon;
            document.querySelectorAll('.avatar-option').forEach(el => {
                el.style.borderColor = 'transparent';
                el.style.transform = 'scale(1)';
            });
            element.style.borderColor = 'var(--color-orange)';
            element.style.transform = 'scale(1.1)';
            playBubble();
        };

        function logMasukMurid() {
            const select = document.getElementById('student-dropdown');
            if(!select.value) { alert("Sila pilih nama dalam senarai!"); return; }
            
            modGuruAktif = false;
            document.body.classList.remove('teacher-mode');
            namaMuridAktif = select.value; 
            studentData[namaMuridAktif].avatar = selectedAvatarIcon;
            saveStudentData();
            if(document.getElementById('nama-murid-papar')) document.getElementById('nama-murid-papar').innerText = namaMuridAktif;
            document.querySelectorAll('.murid-info-name').forEach(el => el.innerText = namaMuridAktif);
            const menuAvatar = document.getElementById('menu-avatar-icon');
            if(menuAvatar) { menuAvatar.className = "fa-solid " + selectedAvatarIcon; }
            document.querySelectorAll('.murid-info-avatar').forEach(el => el.className = "fa-solid murid-info-avatar " + selectedAvatarIcon);
            if(document.getElementById('profil-nama-besar')) document.getElementById('profil-nama-besar').innerText = namaMuridAktif;
            const profileAvatar = document.getElementById('profil-avatar-icon');
            if(profileAvatar) { profileAvatar.className = "fa-solid " + selectedAvatarIcon; }
            const navAvatar = document.getElementById('nav-avatar-icon');
            if(navAvatar) navAvatar.className = "fa-solid " + selectedAvatarIcon;
            
            paparSkrin('main-menu-screen');
            // sebutAudio("Selamat datang " + namaMuridAktif);
            checkDailyLogin();
        }


function checkDailyLogin() {
    if(!namaMuridAktif) return;
        var data = studentData[namaMuridAktif];
        var today = new Date().toISOString().split('T')[0];
        var showRewardCard = false;
    
    if(data.loginData.lastLoginDate !== today) {
        if(data.loginData.lastLoginDate) {
            const lastDate = new Date(data.loginData.lastLoginDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if(diffDays === 1) {
                data.loginData.consecutiveDays += 1;
            } else {
                data.loginData.consecutiveDays = 1;
            }
        } else {
            data.loginData.consecutiveDays = 1;
        }
        data.loginData.lastLoginDate = today;
        saveStudentData();
    }
    
    // Check if eligible for reward
    if(data.loginData.consecutiveDays >= 3 && data.loginData.rewardClaimedDate !== today) {
        showRewardCard = true;
    }
    
    // Update UI
        var rewardCard = document.getElementById('daily-reward-card');
    if(rewardCard) {
        if(showRewardCard) {
            rewardCard.style.display = 'flex';
        } else {
            rewardCard.style.display = 'none';
        }
    }
    
        var streakDisplay = document.getElementById('streak-display');
    if(streakDisplay) {
        streakDisplay.innerText = data.loginData.consecutiveDays;
    }
}

function tuntutGanjaranHarian() {
    if(!namaMuridAktif) return;
        var data = studentData[namaMuridAktif];
        var today = new Date().toISOString().split('T')[0];
    if(data.loginData.consecutiveDays >= 3 && data.loginData.rewardClaimedDate !== today) {
        data.loginData.rewardClaimedDate = today;
        
        if(!data.badges.includes('rajin')) {
            data.badges.push('rajin');
        }
        data.scores.bonusHarian = (data.scores.bonusHarian || 0) + 50;
        saveStudentData();
        
        sebutAudio("Tahniah! Anda dapat ganjaran harian.");
        
        document.getElementById('daily-reward-card').style.display = 'none';
        
        triggerSuccessAnimation("Hebat! +50 Markah Ganjaran Harian.");
    }
}


        var latihanSequence = ['surihHuruf', 'padanan', 'dragdrop', 'belon', 'puzzle', 'carikata', 'tarikgaris', 'kuizaudio', 'susunkata'];

        function getLatihanUnlockKey() {
            return `bunyiKataUnlockedLatihan_${namaMuridAktif || 'Murid'}`;
        }

        function getLatihanUnlockIndex() {
            return Math.max(0, Math.min(latihanSequence.length, Number(localStorage.getItem(getLatihanUnlockKey()) || 0)));
        }

        function unlockNextLatihan(aktiviti) {
            const completedIndex = latihanSequence.indexOf(aktiviti);
            if(completedIndex < 0) return;
            const nextIndex = Math.min(latihanSequence.length, completedIndex + 1);
            if(nextIndex > getLatihanUnlockIndex()) localStorage.setItem(getLatihanUnlockKey(), String(nextIndex));
            renderLatihanLocks();
        }

        function renderLatihanLocks() {
            const cards = document.querySelectorAll('#murid-menu-latihan [data-exercise-index]');
            if(!cards.length) return;
            const data = studentData[namaMuridAktif] || {};
            const unlocked = modGuruAktif ? latihanSequence.length : getLatihanUnlockIndex();
            cards.forEach(card => {
                const index = Number(card.dataset.exerciseIndex);
                const complete = Boolean(data.latihan && data.latihan[card.dataset.exerciseKey]);
                card.classList.toggle('is-locked', index > unlocked && !complete);
                card.classList.toggle('is-complete', complete);
                card.setAttribute('aria-disabled', String(index > unlocked && !complete));
                card.onclick = () => {
                    if(index > unlocked && !complete && !modGuruAktif) {
                        paparBantuan('Selesaikan latihan sebelumnya untuk membuka latihan ini.');
                        return;
                    }
                    navigate(card.dataset.exerciseView, card);
                };
            });
        }

        function logProgress(aktiviti, kategori = 'belajar', markah = 0, lencana = '') {
            if(modGuruAktif) return;
            if(namaMuridAktif && studentData[namaMuridAktif]) {
                studentData[namaMuridAktif][kategori][aktiviti] = true;
                if(markah && studentData[namaMuridAktif].scores) studentData[namaMuridAktif].scores[aktiviti] = Math.max(studentData[namaMuridAktif].scores[aktiviti] || 0, markah);
                if(lencana && !studentData[namaMuridAktif].badges.includes(lencana)) {
                    studentData[namaMuridAktif].badges.push(lencana);
                    if (!studentData[namaMuridAktif].newBadges) studentData[namaMuridAktif].newBadges = [];
                    studentData[namaMuridAktif].newBadges.push(lencana);
                }
                if (!studentData[namaMuridAktif].history) studentData[namaMuridAktif].history = [];
                studentData[namaMuridAktif].history.push({ date: new Date().toISOString(), aktiviti, kategori, markah });
                saveStudentData();
                console.log(`[REKOD] ${namaMuridAktif} selesai ${kategori}: ${aktiviti}`);
                if(kategori === 'latihan') unlockNextLatihan(aktiviti);
            }
        }

        function jumlahMarkah(data) { return Object.values(data.scores || {}).reduce((total, markah) => total + Number(markah || 0), 0); }

        var progressChartInstance = null;
        
        var avatarList = [
            'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png',
            'https://i.postimg.cc/fTp4tg2b/Copy-of-BUNYI-KATA-APPS-(2).png',
            'https://i.postimg.cc/T3DzrqFV/Copy-of-BUNYI-KATA-APPS-(3).png',
            'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png',
            'https://i.postimg.cc/fLw1Q4LX/Copy-of-BUNYI-KATA-APPS-(5).png',
            'https://i.postimg.cc/85t91yJm/Copy-of-BUNYI-KATA-APPS-(6).png'
        ];

        window.bukaModalAvatar = function() {
            tutupSidePanel();
            console.log("bukaModalAvatar invoked. namaMuridAktif:", namaMuridAktif);
            if (!namaMuridAktif) {
                alert("Sila log masuk dahulu!");
                return;
            }
            if (!studentData[namaMuridAktif]) {
                studentData[namaMuridAktif] = studentRecord();
            }
            
            document.getElementById('edit-nama-input').value = namaMuridAktif;
            window.tempSelectedAvatar = studentData[namaMuridAktif].avatar || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
            
            renderAvatarOptions();
            document.getElementById('modal-pilih-avatar').style.display = 'flex';
        };
        
        function renderAvatarOptions() {
            const container = document.getElementById('avatar-options');
            if (container) {
                container.innerHTML = avatarList.map(icon => {
                    const isImg = icon.startsWith('http');
                    const content = isImg ? `<img src="${icon}" style="width:100%; height:100%; object-fit:contain;" />` : `<i class="fa-solid ${icon}" style="color: var(--color-dark);"></i>`;
                    return `
                    <button type="button" class="neo-btn ${window.tempSelectedAvatar === icon ? 'bg-green' : 'bg-white'}" style="width: 100px; height: 100px; padding: 0; border-radius: 50%; overflow: hidden; display:flex; align-items:center; justify-content:center; font-size: 2rem;" onclick="pilihAvatarTemp('${icon}')">
                        ${content}
                    </button>`;
                }).join('');
            }
        }

        window.pilihAvatarTemp = function(icon) {
            window.tempSelectedAvatar = icon;
            renderAvatarOptions();
        };
        
        window.simpanProfilEdit = function() {
            let newName = document.getElementById('edit-nama-input').value.trim();
            if(!newName) return alert('Sila masukkan nama.');
            
            if (newName !== namaMuridAktif) {
                if (studentData[newName]) {
                    return alert('Nama ini sudah wujud, sila pilih nama lain.');
                }
                studentData[newName] = studentData[namaMuridAktif];
                delete studentData[namaMuridAktif];
                namaMuridAktif = newName;
                localStorage.setItem('muridAktif', namaMuridAktif);
            }
            
            studentData[namaMuridAktif].avatar = window.tempSelectedAvatar;
            window.selectedAvatarIcon = window.tempSelectedAvatar;
            saveStudentData();
            updateProfilUI();
            
            // force updates for all elements
            if(document.getElementById('profil-nama-besar')) document.getElementById('profil-nama-besar').innerText = namaMuridAktif;
            document.querySelectorAll('.murid-info-name').forEach(el => el.innerText = namaMuridAktif);
            if(document.getElementById('nav-nama-murid')) document.getElementById('nav-nama-murid').innerText = namaMuridAktif;
            if(document.getElementById('nama-murid-papar')) document.getElementById('nama-murid-papar').innerText = namaMuridAktif;
            
            // Update the dropdown option
            const dropdown = document.getElementById('student-dropdown');
            if(dropdown) {
                let optionExists = false;
                Array.from(dropdown.options).forEach(opt => {
                    if(opt.value === namaMuridAktif) optionExists = true;
                });
                if(!optionExists && newName === namaMuridAktif) {
                     // Normally we'd rename the option, but for simplicity we just make sure it renders
                }
            }
            
            document.getElementById('modal-pilih-avatar').style.display = 'none';
        };

        function animateValue(id, end, duration = 1000) {
            const obj = document.getElementById(id);
            if (!obj) return;
            const start = parseInt(obj.innerText.replace(/,/g, '') || '0', 10);
            if (start === end) {
                obj.innerText = end;
                return;
            }
            
            // Add a small scale effect during animation
            obj.style.transform = 'scale(1.2)';
            obj.style.transition = 'transform 0.1s';
            obj.style.display = 'inline-block';
            obj.style.color = 'var(--color-orange)';
            
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // ease out quad
                const easeProgress = progress * (2 - progress);
                obj.innerText = Math.floor(easeProgress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.innerText = end;
                    obj.style.transform = 'scale(1)';
                    obj.style.color = ''; // reset to original
                }
            };
            window.requestAnimationFrame(step);
        }

        function updateAvatarElement(el, icon) {
            if (!el) return;
            if (icon && icon.startsWith('http')) {
                el.className = el.className.replace(/fa-[a-zA-Z0-9-]+/g, '').replace(/fa-solid/g, '').trim();
                el.style.backgroundImage = 'url("' + icon + '")';
                el.style.backgroundSize = 'contain';
                el.style.backgroundPosition = 'center';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.color = 'transparent';
                el.innerHTML = '';
            } else {
                el.style.backgroundImage = 'none';
                el.className = 'fa-solid ' + (icon || 'fa-child-reaching') + ' ' + el.className.replace(/fa-[a-zA-Z0-9-]+/g, '').replace(/fa-solid/g, '').trim();
                el.style.color = 'var(--color-dark)';
            }
        }

        function updateProfilUI() {
            if (namaMuridAktif && studentData[namaMuridAktif]) {
                const icon = studentData[namaMuridAktif].avatar || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                document.querySelectorAll('.murid-info-avatar').forEach(el => updateAvatarElement(el, icon));
                updateAvatarElement(document.getElementById('profil-avatar-icon'), icon);
                updateAvatarElement(document.getElementById('nav-avatar-icon'), icon);
                updateAvatarElement(document.getElementById('menu-avatar-icon'), icon);
                if (document.getElementById('side-panel-jumlah-markah')) {
                    animateValue('side-panel-jumlah-markah', jumlahMarkah(studentData[namaMuridAktif]));
                }
            }
        }

        function renderProfile() {
            const data = studentData[namaMuridAktif] || studentRecord();
            if(document.getElementById('profil-jumlah-markah')) {
                animateValue('profil-jumlah-markah', jumlahMarkah(data));
            }
            
            const badgeNames = { 
                surihHuruf: ['Pakar Surih', 'fa-pencil', 'bg-blue', 'Selesaikan Latihan Surih Huruf'], 
                padanan: ['Pakar Padanan', 'fa-link', 'bg-red', 'Selesaikan Padanan Gambar'], 
                dragdrop: ['Juara Suku Kata', 'fa-hand-pointer', 'bg-purple', 'Selesaikan Drag & Drop'], 
                belon: ['Pemburu Belon', 'fa-burst', 'bg-green', 'Selesaikan Letup Belon'], 
                puzzle: ['Pakar Ejaan', 'fa-puzzle-piece', 'bg-yellow', 'Selesaikan Cabaran Ejaan'],
                carikata: ['Mata Helang', 'fa-magnifying-glass', 'bg-orange', 'Selesaikan Cari Kata'],
                tarikgaris: ['Penghubung', 'fa-arrows-left-right', 'bg-blue', 'Selesaikan Tarik Garisan'],
                kuizaudio: ['Telinga Lintah', 'fa-headphones', 'bg-yellow', 'Selesaikan Kuiz Audio'],
                susunkata: ['Arkitek Kata', 'fa-cubes', 'bg-purple', 'Selesaikan Susun Kata'],
                rajin: ['Murid Rajin', 'fa-calendar-check', 'bg-orange', 'Log masuk 3 hari berturut-turut']
            };
            
            let htmlIncomplete = '';
            let htmlBadges = '';
            let earnedCount = 0;
            const totalBadges = Object.keys(badgeNames).length;

            Object.entries(badgeNames).forEach(([key, info]) => {
                const hasBadge = (data.badges || []).includes(key);
                let markah = (data.scores && data.scores[key]) ? data.scores[key] : 0;
                
                let starsEarned = 0;
                if(hasBadge) starsEarned = 3;
                else if (markah >= 50) starsEarned = 2;
                else if (markah > 0) starsEarned = 1;
                
                let starsHTML = `<div style="display:flex; gap:2px; font-size:0.65rem; color:#cbd5e1;">`;
                for(let i=0; i<3; i++) {
                    starsHTML += `<i class="fa-solid fa-star ${i < starsEarned ? 'earned' : ''}" style="${i < starsEarned ? 'color:#ffc107; filter:drop-shadow(0 0 2px rgba(255,193,7,0.5));' : ''}"></i>`;
                }
                starsHTML += `</div>`;
                
                let markahHTML = `<div style="font-size:0.7rem; font-weight:bold; color:var(--color-dark); display:flex; align-items:center; gap:3px;"><i class="fa-solid fa-coins" style="color:gold;"></i> ${markah}</div>`;
                
                if (!hasBadge) {
                    htmlIncomplete += `<div class="neo-box" style="padding: 8px 10px; display: flex; align-items: center; gap: 6px; background: white; border: 2px solid var(--color-dark); box-shadow: 1px 2px 0 var(--color-dark);">
                        <div style="font-size: 1rem; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 50%; color: var(--color-dark); flex-shrink:0;"><i class="fa-solid ${info[1]}"></i></div>
                        <div style="flex: 1; text-align: left; overflow:hidden;">
                            <h4 style="margin: 0; font-size: 0.75rem; color: var(--color-dark); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${info[0]}">${info[0]}</h4>
                            <div style="display:flex; align-items:center; gap:6px; margin-top:2px; flex-wrap: wrap;">
                                ${starsHTML}
                                ${markahHTML}
                            </div>
                        </div>
                        <div style="color: #ef4444; font-size: 1rem; flex-shrink:0;"><i class="fa-solid fa-circle-xmark"></i></div>
                    </div>`;
                } else {
                    earnedCount++;
                }

                const bgClass = hasBadge ? info[2] : 'bg-gray';
                const opacityClass = hasBadge ? '' : 'opacity: 0.6; filter: grayscale(100%);';
                const lockIcon = hasBadge ? '' : '<div style="position: absolute; top: 10px; right: 10px; font-size: 1.5rem; color: var(--color-dark);"><i class="fa-solid fa-lock"></i></div>';
                
                htmlBadges += `<div class="neo-box badge-board-card ${bgClass}" style="position: relative; ${opacityClass}">
                            ${lockIcon}
                            <i class="fa-solid ${info[1]}"></i>
                            <h3>${info[0]}</h3>
                            <p>${info[3]}</p>
                            <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px; background:rgba(255,255,255,0.2); padding:4px 8px; border-radius:12px;">
                                ${starsHTML}
                                ${markahHTML}
                            </div>
                        </div>`;
            });
            
            if(htmlIncomplete === '') {
                htmlIncomplete = `<div style="text-align:center; padding: 20px; font-weight:bold; color:var(--color-green);"><i class="fa-solid fa-check-circle" style="font-size:2rem; margin-bottom:10px; display:block;"></i>Tahniah! Semua tugasan telah diselesaikan.</div>`;
            }

            const incContainer = document.getElementById('incomplete-modules-container');
            if(incContainer) incContainer.innerHTML = htmlIncomplete;

            const badgeGrid = document.getElementById('badge-grid');
            if(badgeGrid) {
                badgeGrid.className = 'badge-board';
                badgeGrid.innerHTML = htmlBadges;
            }

            const sijilBtn = document.getElementById('sijil-btn');
            if(sijilBtn) {
                if(earnedCount === totalBadges) {
                    sijilBtn.disabled = false;
                    sijilBtn.style.opacity = '1';
                    sijilBtn.classList.remove('bg-yellow');
                    sijilBtn.classList.add('bg-green');
                    sijilBtn.style.cursor = 'pointer';
                } else {
                    sijilBtn.disabled = true;
                    sijilBtn.style.opacity = '0.5';
                    sijilBtn.classList.remove('bg-green');
                    sijilBtn.classList.add('bg-yellow');
                    sijilBtn.style.cursor = 'not-allowed';
                }
            }
            
            // Render Chart
            const ctxChart = document.getElementById('progressChart');
            if(ctxChart && typeof Chart !== 'undefined') {
                if(progressChartInstance) {
                    progressChartInstance.destroy();
                }
                
                const scores = data.scores || {};
                const labels = ['Surih', 'Padanan', 'Drag Drop', 'Belon', 'Ejaan', 'Cari Kata', 'Garis', 'Audio', 'Susun'];
                const dataPoints = [
                    scores.surihHuruf || 0,
                    scores.padanan || 0,
                    scores.dragdrop || 0,
                    scores.belon || 0,
                    scores.puzzle || 0,
                    scores.carikata || 0,
                    scores.tarikgaris || 0,
                    scores.kuizaudio || 0,
                    scores.susunkata || 0
                ];
                
                const isDarkMode = document.body.classList.contains('dark-mode');
                const textColor = isDarkMode ? '#f8fafc' : '#10182f';
                const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                
                progressChartInstance = new Chart(ctxChart, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Markah Tertinggi',
                            data: dataPoints,
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 2,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { 
                                beginAtZero: true, 
                                ticks: { color: textColor, stepSize: 1 },
                                grid: { color: gridColor }
                            },
                            x: {
                                ticks: { color: textColor, maxRotation: 45, minRotation: 45 },
                                grid: { display: false }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }
            
            if (data.newBadges && data.newBadges.length > 0) {
                setTimeout(() => {
                    data.newBadges = [];
                    saveStudentData();
                }, 2000);
            }
        }

        window.resetProgresMurid = function(nama) {
            if(confirm('Adakah anda pasti ingin menetapkan semula progres (markah & lencana) untuk murid: ' + nama + '?')) {
                if(studentData[nama]) {
                    studentData[nama] = {
                        belajar: { kad: false, cerita: false, surih: false, kotak: false },
                        latihan: {
                            surihHuruf: false, padanan: false, dragdrop: false,
                            belon: false, puzzle: false, carikata: false,
                            tarikgaris: false, kuizaudio: false, susunkata: false
                        },
                        scores: {
                            surihHuruf: 0, padanan: 0, dragdrop: 0,
                            belon: 0, puzzle: 0, carikata: 0,
                            tarikgaris: 0, kuizaudio: 0, susunkata: 0
                        },
                        badges: []
                    };
                    saveStudentData();
                    renderTeacherTable();
                    alert('Progres murid ' + nama + ' telah di-reset.');
                }
            }
        };

        window.renderTeacherTable = function(moduleId) {
            const tbody = document.getElementById('guru-table-body');
            if(!tbody) return;
            tbody.innerHTML = ''; // Kosongkan jadual

            const tahapFilter = window.tahapFilter || 'all';

            for (const [nama, data] of Object.entries(studentData)) {
                const lencanaCount = (data.badges || []).length;
                
                if (tahapFilter === 'cemerlang' && lencanaCount <= 5) continue;
                if (tahapFilter === 'sederhana' && (lencanaCount < 2 || lencanaCount > 5)) continue;
                if (tahapFilter === 'lemah' && lencanaCount >= 2) continue;

                const iconDone = '<i class="fa-solid fa-circle-check status-icon status-done"></i>';
                const iconPend = '<i class="fa-solid fa-circle-xmark status-icon status-pend"></i>';
                
                const l = data.latihan || {};
                const s = data.scores || {};

                const rowHTML = `
                    <tr>
                        <td>${nama}</td>
                        <td><strong>${jumlahMarkah(data)}</strong> / 90</td>
                        <td><strong>${lencanaCount}</strong></td>
                        <!-- Latihan -->
                        <td>${l.surihHuruf ? iconDone : iconPend}<br><small>${s.surihHuruf || 0}/10</small></td>
                        <td>${l.padanan ? iconDone : iconPend}<br><small>${s.padanan || 0}/10</small></td>
                        <td>${l.dragdrop ? iconDone : iconPend}<br><small>${s.dragdrop || 0}/10</small></td>
                        <td>${l.belon ? iconDone : iconPend}<br><small>${s.belon || 0}/10</small></td>
                        <td>${l.puzzle ? iconDone : iconPend}<br><small>${s.puzzle || 0}/10</small></td>
                        <td>${l.carikata ? iconDone : iconPend}<br><small>${s.carikata || 0}/10</small></td>
                        <td>${l.tarikgaris ? iconDone : iconPend}<br><small>${s.tarikgaris || 0}/10</small></td>
                        <td>${l.kuizaudio ? iconDone : iconPend}<br><small>${s.kuizaudio || 0}/10</small></td>
                        <td>${l.susunkata ? iconDone : iconPend}<br><small>${s.susunkata || 0}/10</small></td>
                        <td>
                            <button class="neo-btn bg-red" style="padding: 5px 10px; font-size: 0.8rem; min-width: unset; height: auto;" onclick="resetProgresMurid('${nama}')">
                                <i class="fa-solid fa-rotate-left"></i> Reset
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += rowHTML;
            }
            renderClassOverviewChart();
        }
        
        var classOverviewChartInstance = null;
        function renderClassOverviewChart() {
            const ctx = document.getElementById('classOverviewChart');
            if (!ctx || typeof Chart === 'undefined') return;
            
            const exerciseKeys = ['surihHuruf', 'padanan', 'dragdrop', 'belon', 'puzzle', 'carikata', 'tarikgaris', 'kuizaudio', 'susunkata'];
            const labels = ['Surih', 'Padanan', 'Drag Drop', 'Belon', 'Ejaan', 'Cari Kata', 'Garis', 'Audio', 'Susun'];
            
            // Calculate average score for each exercise (lower = more difficult)
            // or we can calculate difficulty as (10 - average score) to show higher bar for more difficult
            let totalScores = new Array(exerciseKeys.length).fill(0);
            let totalStudents = Object.keys(studentData).length;
            
            for (const data of Object.values(studentData)) {
                exerciseKeys.forEach((key, index) => {
                    totalScores[index] += (data.scores && data.scores[key]) ? data.scores[key] : 0;
                });
            }
            
            const difficultyScores = totalScores.map(score => {
                const avg = totalStudents > 0 ? (score / totalStudents) : 0;
                // max score per exercise is 10.
                return 10 - avg;
            });

            if (classOverviewChartInstance) {
                classOverviewChartInstance.destroy();
            }

            classOverviewChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Tahap Kesukaran (Kesilapan/Belum Siap)',
                        data: difficultyScores,
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 2,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Tahap Kesukaran (10 = Paling Sukar)'
                            }
                        }
                    }
                }
            });
        }

        function renderLeaderboard() {
            // Get all students and sort by score descending
            const studentsArr = Object.entries(studentData).map(([nama, data]) => {
                return { name: nama, score: jumlahMarkah(data), avatar: data.avatar || "https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" };
            });
            studentsArr.sort((a, b) => b.score - a.score);

            const grandstandEl = document.getElementById('leaderboard-grandstand');
            const listEl = document.getElementById('leaderboard-list');
            
            grandstandEl.innerHTML = '';
            listEl.innerHTML = '';

            // Top 3
            const top3 = studentsArr.slice(0, 3);
            
            // We want the order to be visually: 2nd, 1st, 3rd.
            const podiumPositions = [
                { rank: 2, data: top3[1], cls: 'podium-2', iconColor: 'color: #cbd5e1' },
                { rank: 1, data: top3[0], cls: 'podium-1', iconColor: 'color: gold' },
                { rank: 3, data: top3[2], cls: 'podium-3', iconColor: 'color: #d97706' }
            ];

            podiumPositions.forEach(pos => {
                if(pos.data) {
                    const isCurrentUser = pos.data.name === namaMuridAktif;
                    const highlightStyle = isCurrentUser ? 'box-shadow: 0 0 15px var(--color-blue);' : '';
                    grandstandEl.innerHTML += `
                        <div class="podium ${pos.cls}" style="${highlightStyle}">
                            <div class="podium-avatar">${pos.data.avatar.startsWith('http') ? `<div style="width:100%; height:100%; border-radius:50%; background-image:url('${pos.data.avatar}'); background-size:contain; background-position:center; background-repeat:no-repeat; background-color:white;"></div>` : `<i class="fa-solid ${pos.data.avatar}" style="${pos.iconColor}; text-shadow: 1px 1px 0 #000;"></i>`}</div>
                            <div class="podium-name" style="${isCurrentUser ? 'color:var(--color-blue);' : ''}">${pos.data.name}</div>
                            <div class="podium-score">${pos.data.score}</div>
                            <div class="podium-rank">${pos.rank}</div>
                        </div>
                    `;
                } else {
                    grandstandEl.innerHTML += `<div class="podium ${pos.cls}" style="opacity: 0.5;"></div>`;
                }
            });

            // The rest
            const rest = studentsArr.slice(3);
            rest.forEach((student, index) => {
                const isCurrentUser = student.name === namaMuridAktif;
                const highlightStyle = isCurrentUser ? 'border-color: var(--color-blue); background: #eff6ff;' : '';
                listEl.innerHTML += `
                    <div class="leaderboard-item" style="${highlightStyle}">
                        <div class="leaderboard-item-rank">#${index + 4}</div>
                        <div class="leaderboard-item-name" style="${isCurrentUser ? 'color:var(--color-blue);' : ''}">
${student.avatar.startsWith('http') ? `<div style="display:inline-block; width:24px; height:24px; margin-right:8px; border-radius:50%; background-image:url('${student.avatar}'); background-size:contain; background-position:center; background-repeat:no-repeat; vertical-align:middle;"></div>` : `<i class="fa-solid ${student.avatar}" style="margin-right:8px; opacity:0.8;"></i>`}
${student.name}</div>
                        <div class="leaderboard-item-score">${student.score}</div>
                    </div>
                `;
            });
        }

        // --- SISTEM PETA ---
        function kembaliKePilihPeta() {
            paparSkrin('main-menu-screen');
            bukaModalPilihPeta(modSemasa || 'belajar');
        }

        function bukaModalPilihPeta(mod) {
            modSemasa = mod;
            const petaTajuk = document.getElementById('modal-pilih-peta-tajuk'); 
            if(petaTajuk) {
                petaTajuk.innerText = mod === 'belajar' ? 'PILIH PETA KEMBARA' : 'PILIH PETA LATIHAN';
                if (mod === 'latihan') {
                    petaTajuk.classList.remove('bg-orange');
                    petaTajuk.classList.add('bg-purple');
                } else {
                    petaTajuk.classList.remove('bg-purple');
                    petaTajuk.classList.add('bg-orange');
                }
            }
            
            const btnTexts = document.querySelectorAll('#modal-pilih-peta .map-select-text');
            const titles = ['Huruf', 'Suku Kata Asas', 'Suku Kata Hero', 'Bacaan Bergred'];
            btnTexts.forEach((btn, index) => {
                if(titles[index]) {
                    btn.innerText = (mod === 'belajar' ? 'Misi ' : 'Cabaran ') + titles[index];
                }
            });

            document.getElementById('modal-pilih-peta').style.display = 'flex';
        }
        function tutupModal() {
            document.getElementById('modal-pilih-peta').style.display = 'none';
        }
        function bukaPeta(nomborPeta, skipScreenChange = false) {
            window.currentPeta = nomborPeta;
            tutupModal();
            const prefix = modSemasa === 'belajar' ? 'MISI ' : 'CABARAN ';
            const mapTitles = { 1: prefix + 'HURUF', 2: prefix + 'SUKU KATA ASAS', 3: prefix + 'SUKU KATA HERO', 4: prefix + 'BACAAN BERGRED' };
            
            const titleBar = document.getElementById('map-title-bar');
            if (titleBar) {
                titleBar.innerHTML = mapTitles[nomborPeta] || `PETA ${nomborPeta}`;
                if (modSemasa === 'latihan') {
                    titleBar.classList.remove('bg-orange');
                    titleBar.classList.add('bg-purple');
                } else {
                    titleBar.classList.remove('bg-purple');
                    titleBar.classList.add('bg-orange');
                }
            }
            
            const backBtn = document.getElementById('map-back-btn');
            if (backBtn) {
                if (modSemasa === 'latihan') {
                    backBtn.classList.remove('bg-orange');
                    backBtn.classList.add('bg-purple');
                } else {
                    backBtn.classList.remove('bg-purple');
                    backBtn.classList.add('bg-orange');
                }
            }
            
            const mapArea = document.getElementById('map-board-area');
            mapArea.innerHTML = ''; 
            
            let modules = [];
            if (nomborPeta === 1) {
                modules = [
                    { id: "kenali_huruf", title: "Cabaran Kenali Huruf", content: "A a B b", image: "https://i.postimg.cc/W32TBcmP/Copy-of-BUNYI-KATA-APPS-(7).png", color: "#90b562" },
                    { id: "huruf_vokal", title: "Cabaran Huruf Vokal", content: "A E I O U", image: "https://i.postimg.cc/ZnQmv911/Copy-of-BUNYI-KATA-APPS-(6).png", color: "#90b562" },
                    { id: "huruf_konsonan", title: "Cabaran Huruf Konsonan", content: "B C D F G", image: "https://i.postimg.cc/MZ3qF4nk/Copy-of-BUNYI-KATA-APPS-(5).png", color: "#90b562" },
                    { id: "fonik_abc", title: "Cabaran Fonik ABC", content: "a b c", image: "https://i.postimg.cc/PrLTs4Dx/Copy-of-BUNYI-KATA-APPS-(8).png", color: "#90b562" }
                ];
            } else if (nomborPeta === 2) {
                modules = [
                    { id: "suku_kata_kv", title: "Cabaran KV", content: "ba ca", image: "https://i.postimg.cc/qv4G9mt5/Copy-of-BUNYI-KATA-APPS-(9).png", color: "#c1a472" },
                    { id: "suku_kata_kv_kv", title: "Cabaran KV + KV", content: "ba pa", image: "https://i.postimg.cc/nh21ZvB7/Copy-of-BUNYI-KATA-APPS-(10).png", color: "#c1a472" },
                    { id: "suku_kata_v_kv", title: "Cabaran V + KV", content: "a yam", image: "https://i.postimg.cc/L5jzWfm1/Copy-of-BUNYI-KATA-APPS-(12).png", color: "#c1a472" },
                    { id: "suku_kata_kv_kv_kv", title: "Cabaran KV + KV + KV", content: "ke ru si", image: "https://i.postimg.cc/rm0GS3b0/Copy-of-BUNYI-KATA-APPS-(11).png", color: "#c1a472" },
                    { id: "suku_kata_kvk", title: "Cabaran KVK", content: "beg mop", image: "https://i.postimg.cc/TYqVqrkz/Copy-of-BUNYI-KATA-APPS-(13).png", color: "#c1a472" },
                    { id: "suku_kata_v_kvk", title: "Cabaran V + KVK", content: "u bat", image: "https://i.postimg.cc/HkYQSVR7/Copy-of-BUNYI-KATA-APPS-(14).png", color: "#c1a472" }
                ];
            } else if (nomborPeta === 3) {
                modules = [
                    { id: "suku_kata_kv_kvk", title: "Cabaran KV + KVK", content: "ka sut", image: "https://i.postimg.cc/nrfdMnzL/Copy-of-BUNYI-KATA-APPS-(15).png", color: "#ff751f" },
                    { id: "suku_kata_kvk_kv", title: "Cabaran KVK + KV", content: "bot ku", image: "https://i.postimg.cc/kGNTbL6f/Copy-of-BUNYI-KATA-APPS-(16).png", color: "#ff751f" },
                    { id: "suku_kata_kvk_kvk", title: "Cabaran KVK + KVK", content: "dok tor", image: "https://i.postimg.cc/2jncMLc2/Copy-of-BUNYI-KATA-APPS-(17).png", color: "#ff751f" },
                    { id: "suku_kata_kvkk", title: "Cabaran KVKK", content: "bank zink", image: "https://i.postimg.cc/ZKZ7SYXZ/Copy-of-BUNYI-KATA-APPS-(18).png", color: "#ff751f" },
                    { id: "suku_kata_kv_kv_kvk", title: "Cabaran KV + KV + KVK", content: "ke re ta", image: "https://i.postimg.cc/QddfF4Xp/Copy-of-BUNYI-KATA-APPS-(19).png", color: "#ff751f" },
                    { id: "suku_kata_kvk_kv_kvk", title: "Cabaran KVK + KV + KVK", content: "sem pur na", image: "https://i.postimg.cc/LsrD0mj1/Copy-of-BUNYI-KATA-APPS-(20).png", color: "#ff751f" }
                ];
            } else if (nomborPeta === 4) {
                modules = [
                    { id: "ayat_mudah", title: "Ayat Mudah", content: "Ayat", image: "https://i.postimg.cc/5trVjQL8/Copy-of-BUNYI-KATA-APPS-(21).png", color: "#ff66c4" },
                    { id: "ayat_pendek", title: "Ayat Pendek", content: "Ayat Pendek", image: "https://i.postimg.cc/28YfqDb0/Copy-of-BUNYI-KATA-APPS-(22).png", color: "#ff66c4" },
                    { id: "ayat_panjang", title: "Ayat Panjang", content: "Ayat Panjang", image: "https://i.postimg.cc/zBh9BtJ3/Copy-of-BUNYI-KATA-APPS-(23).png", color: "#ff66c4" },
                    { id: "petikan_tahap_1", title: "Petikan Tahap 1", content: "Petikan 1", image: "https://i.postimg.cc/RZ0yfVSS/Copy-of-BUNYI-KATA-APPS-(24).png", color: "#ff66c4" },
                    { id: "petikan_tahap_2", title: "Petikan Tahap 2", content: "Petikan 2", image: "https://i.postimg.cc/J4pd1Vby/Copy-of-BUNYI-KATA-APPS-(25).png", color: "#ff66c4" },
                    { id: "cerita_pendek", title: "Cerita Pendek", content: "Cerita", image: "https://i.postimg.cc/qRH1mkTV/Copy-of-BUNYI-KATA-APPS-(26).png", color: "#ff66c4" }
                ];
            }


            window.currentPetaModules = modules;
            modules.forEach((modul, moduleIndex) => {
                let displayTitle = modul.title;
                if (modSemasa === 'belajar') {
                    displayTitle = displayTitle.replace(/^Cabaran\s+/i, '');
                }
                let starsHTML = '';
                
                let unlockedIndex = 0;
                let isLockedForUser = false;
                let moduleComplete = false;
                
                if (modSemasa === 'latihan') {
                    unlockedIndex = 0;
                    for (let i = 0; i < modules.length; i++) {
                        if (i === 0) {
                            unlockedIndex = 0;
                        } else {
                            const prevId = modules[i-1].id;
                            const prevStars = Number(localStorage.getItem('stars_' + prevId) || 0);
                            if (prevStars >= 1) {
                                unlockedIndex = i;
                            } else {
                                break;
                            }
                        }
                    }
                    if (modGuruAktif) unlockedIndex = modules.length;
                    
                    const stars = Number(localStorage.getItem('stars_' + modul.id) || 0);
                    let star1 = stars >= 1 ? 'earned' : '';
                    let star2 = stars >= 2 ? 'earned' : '';
                    let star3 = stars >= 3 ? 'earned' : '';
                    starsHTML = `<div class="stars-container"><i class="fa-solid fa-star star ${star1}"></i><i class="fa-solid fa-star star ${star2}"></i><i class="fa-solid fa-star star ${star3}"></i></div>`;
                    
                    moduleComplete = moduleIndex < unlockedIndex || stars > 0;
                    isLockedForUser = !modGuruAktif && (moduleIndex > unlockedIndex);
                } else {
                    window.sessionBelajarProgress = window.sessionBelajarProgress || {};
                    let defaultUnlocked = (window.currentPeta === 1 || window.currentPeta === 4) ? 2 : 0;
                    if (window.sessionBelajarProgress[window.currentPeta] === undefined) {
                        window.sessionBelajarProgress[window.currentPeta] = defaultUnlocked;
                    }
                    unlockedIndex = modGuruAktif ? modules.length : window.sessionBelajarProgress[window.currentPeta];
                    isLockedForUser = !modGuruAktif && (modul.locked || moduleIndex > unlockedIndex);
                }

                const lockedClass = isLockedForUser ? 'locked' : '';
                const activeClass = (!isLockedForUser && moduleIndex === unlockedIndex) ? 'active-level' : '';
                const completedClass = (!isLockedForUser && moduleIndex < unlockedIndex) ? 'completed-level' : '';
                const clickAction = isLockedForUser ? "alert('Tahap Terkunci!')" : `klikModul('${modul.id}', '${displayTitle}')`;
                
                mapArea.innerHTML += `
                    <div class="island-node ${lockedClass} ${activeClass} ${completedClass}" onclick="${clickAction}">
                        <div class="island-tape" style="background: ${modul.color};"></div>
                        ${starsHTML}
                        <div class="island-inner-box ${lockedClass}" style="border-color: ${modul.color};">
                            ${isLockedForUser ? '<i class="fa-solid fa-lock module-lock-icon" style="position: absolute; z-index: 10; color: white; font-size: 2.5rem; text-shadow: 0px 2px 4px rgba(0,0,0,0.8);" aria-label="Terkunci"></i>' : ''}
                            ${modul.image ? `<div class="island-inner-image" style="background-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)), url('${modul.image}');"></div>` : (isLockedForUser ? '' : `<div class="island-inner-text">${modul.content}</div>`)}
                        </div>
                        <div class="island-title-text">${displayTitle}</div>
                    </div>
                `;
            });
            
            const caraBelajarLain = document.getElementById('cara-belajar-lain-section');
            if (caraBelajarLain) {
                if ((nomborPeta === 1 || nomborPeta === 2 || nomborPeta === 3) && modSemasa === 'belajar') {
                    caraBelajarLain.style.display = 'block';
                    document.getElementById('map-screen').classList.add('show-cara-belajar');
                    const btnHuruf = document.querySelectorAll('.cara-belajar-btn.untuk-huruf');
                    const btnSukukata = document.querySelectorAll('.cara-belajar-btn.untuk-sukukata');
                    if (nomborPeta === 1) {
                        btnHuruf.forEach(b => b.style.display = '');
                        btnSukukata.forEach(b => b.style.display = 'none');
                    } else {
                        btnHuruf.forEach(b => b.style.display = 'none');
                        btnSukukata.forEach(b => b.style.display = '');
                    }
                    
                    const mobileCta = document.getElementById('mobile-floating-cta');
                    if (mobileCta) mobileCta.style.display = 'flex';
                } else {
                    caraBelajarLain.style.display = 'none';
                    document.getElementById('map-screen').classList.remove('show-cara-belajar');
                    const mobileCta = document.getElementById('mobile-floating-cta');
                    if (mobileCta) mobileCta.style.display = 'none';
                }
            }

            if (!skipScreenChange) paparSkrin('map-screen');
        }

        window.initBelon = function() {
            const bc = document.getElementById('balloon-container');
            if (bc) {
                const balloons = bc.querySelectorAll('.balloon');
                if (balloons.length === 3) {
                    balloons[0].style.display = 'flex'; balloons[0].style.backgroundColor = 'var(--color-red)'; balloons[0].innerText = 'bas'; balloons[0].style.transform = 'none';
                    balloons[1].style.display = 'flex'; balloons[1].style.backgroundColor = 'var(--color-green)'; balloons[1].innerText = 'bot'; balloons[1].style.transform = 'none';
                    balloons[2].style.display = 'flex'; balloons[2].style.backgroundColor = 'var(--color-blue)'; balloons[2].innerText = 'van'; balloons[2].style.transform = 'none';
                }
            }
            updateProgressBar('pb-latihan-3', 0);
            navigate('latihan-3');
        };

        function navigate(viewId, btnNode) {
            if(viewId === 'latihan-1') initTraceLetters();
            if(viewId === 'learn-4') initKotakFonik();
            if(viewId === 'learn-1') initFlashcard();
            if(viewId === 'latihan-2') initPadanan();
            if(viewId === 'latihan-5') initDragDrop();
            if(viewId === 'latihan-4') initPuzzleEjaan();
            if(viewId === 'latihan-carikata') initCariKata();
            if(viewId === 'latihan-tarikgaris') initTarikGaris();
            if(viewId === 'latihan-susunkata') initSusunKata();
            if(viewId === 'latihan-kuizaudio') initKuizAudio();
            if(viewId === 'latihan-3') { if (window.initBelon) window.initBelon(); }
            if(viewId === 'learn-2') initCeritaAudio();
            
            const targetView = document.getElementById('view-' + viewId);
            if(targetView) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                targetView.classList.add('active');
            } else {
                console.warn("Paparan tidak wujud: view-" + viewId);
                alert("Modul ini masih dalam pembinaan.");
            }
        }

        function setTraceLetterOld(letter) {
            // Replaced by new implementation below
        }

        function initTraceLettersOld() {
            // Replaced by new implementation below
        }

        var padananPilihan = [];
        function initPadanan() {
            padananPilihan = [];
            const board = document.querySelector('#view-latihan-2 .match-board');
            let items = [{back: 'NASI', icon: '🍚'}, {back: 'SUDU', icon: '🥄'}];
            
            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards;
                if (cards.length >= 2) items = cards.slice(0, 2);
            }

            if (board) {
                board.innerHTML = `
                    <button class="match-option" data-match="${items[0].back}" onclick="pilihPadanan(this)"><div style="font-size: 2rem;">${items[0].icon}</div></button>
                    <button class="match-option" data-match="${items[1].back}" onclick="pilihPadanan(this)">${items[1].back}</button>
                    <button class="match-option" data-match="${items[0].back}" onclick="pilihPadanan(this)">${items[0].back}</button>
                    <button class="match-option" data-match="${items[1].back}" onclick="pilihPadanan(this)"><div style="font-size: 2rem;">${items[1].icon}</div></button>
                `;
            }
            const saved = getAutoSave('padanan') || [];
            document.querySelectorAll('#view-latihan-2 .match-option').forEach((el, idx) => {
                el.classList.remove('selected', 'matched');
                el.dataset.idx = idx;
                if(saved.includes(idx)) el.classList.add('matched');
            });
            updateProgressBar("pb-latihan-2", (document.querySelectorAll("#view-latihan-2 .match-option.matched").length / 4) * 100);
        }
        function pilihPadanan(el) {
            if(el.classList.contains('matched')) return;
            el.classList.toggle('selected');
            if(el.classList.contains('selected')) padananPilihan.push(el); else padananPilihan = padananPilihan.filter(item => item !== el);
            if(padananPilihan.length > 2) { const first = padananPilihan.shift(); first.classList.remove('selected'); }
        }
        function semakPadanan() {
            if(padananPilihan.length !== 2 || padananPilihan[0].dataset.match !== padananPilihan[1].dataset.match) { 
                sebutAudio('Cuba lagi'); 
                padananPilihan.forEach(el => triggerErrorAnimation(el));
                setTimeout(() => {
                    padananPilihan.forEach(el => el.classList.remove('selected')); 
                    padananPilihan = []; 
                }, 400);
                return; 
            }
            padananPilihan.forEach(el => { el.classList.remove('selected'); el.classList.add('matched'); });
            
            updateProgressBar("pb-latihan-2", (document.querySelectorAll("#view-latihan-2 .match-option.matched").length / 4) * 100);
            const matched = Array.from(document.querySelectorAll('#view-latihan-2 .match-option.matched')).map(e => parseInt(e.dataset.idx));
            setAutoSave('padanan', matched);
            
            padananPilihan = [];
            const selesai = document.querySelectorAll('#view-latihan-2 .match-option.matched').length === 4;
            if(selesai) { 
                clearAutoSave('padanan');
                logProgress('padanan', 'latihan', 10, 'padanan'); 
                sebutAudio('Hebat! Semua padanan betul.'); 
                triggerSuccessAnimation('Tahniah! Lencana Pakar Padanan diperoleh.', () => paparSkrin('murid-menu-latihan'), () => navigate('latihan-2'));
            }
        }

        var dragSyllable = '';
        var dragDropWord = ["ta", "li"];
        function initDragDrop() {
            const board = document.querySelector('#view-latihan-5 .drag-board');
            dragDropWord = ["ta", "li"];
            
            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards;
                let wordWithDashes = cards[0].front;
                if(wordWithDashes.includes('-')) {
                    dragDropWord = wordWithDashes.split('-').map(s => s.trim());
                } else {
                    dragDropWord = [wordWithDashes];
                }
            }

            if (board) {
                let shuffled = [...dragDropWord];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                
                let optionsHTML = shuffled.map(s => `<button class="neo-btn drag-option bg-yellow" draggable="true" data-syllable="${s}">${s}</button>`).join('');
                let slotsHTML = dragDropWord.map(s => `<div class="drop-slot" data-answer="${s}" ondragover="allowDrop(event)" ondragleave="event.currentTarget.classList.remove('over')" ondrop="dropSyllable(event)">Letak sini</div>`).join('');

                board.innerHTML = `
                    <div class="drag-options">${optionsHTML}</div>
                    <div class="drop-slots">${slotsHTML}</div>
                `;
                board.querySelectorAll('.drag-option').forEach(option => {
                    option.addEventListener('dragstart', e => { dragSyllable = e.target.dataset.syllable; });
                });
            }
            const saved = getAutoSave('dragdrop') || {};
            let correctCount = 0;
            document.querySelectorAll('#view-latihan-5 .drop-slot').forEach((slot, idx) => {
                slot.dataset.idx = idx;
                if(saved[idx]) {
                    slot.innerText = saved[idx];
                    slot.dataset.value = saved[idx];
                    if (saved[idx] === slot.dataset.answer) correctCount++;
                } else {
                    slot.innerText = "Letak sini";
                    slot.dataset.value = "";
                }
            });
            updateProgressBar('pb-latihan-5', (correctCount / dragDropWord.length) * 100);
        }

        function allowDrop(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
        function dropSyllable(e) { 
            e.preventDefault(); 
            const slot = e.currentTarget; 
            slot.classList.remove('over'); 
            slot.innerText = dragSyllable; 
            slot.dataset.value = dragSyllable; 
            
            const saved = getAutoSave('dragdrop') || {};
            saved[slot.dataset.idx] = dragSyllable;
            setAutoSave('dragdrop', saved);
            
            let correctCount = 0;
            const slots = document.querySelectorAll('#view-latihan-5 .drop-slot');
            slots.forEach(s => {
                if(s.dataset.value === s.dataset.answer) correctCount++;
            });
            updateProgressBar('pb-latihan-5', (correctCount / dragDropWord.length) * 100);
        }
        function semakDragDrop() {
            const slots = [...document.querySelectorAll('#view-latihan-5 .drop-slot')];
            if(slots.every(slot => slot.dataset.value === slot.dataset.answer)) { 
                clearAutoSave('dragdrop');
                logProgress('dragdrop', 'latihan', 10, 'dragdrop'); 
                sebutAudio('Hebat! Perkataan berjaya dibina.'); 
                triggerSuccessAnimation('Tahniah! Lencana Juara Suku Kata diperoleh.', () => paparSkrin('murid-menu-latihan'), () => navigate('latihan-5'));
            } else {
                sebutAudio('Cuba susun semula.');
                slots.forEach(slot => { if(slot.dataset.value !== slot.dataset.answer) triggerErrorAnimation(slot); });
            }
        }

        
        var currentModuleId = null;
        var currentModuleTitle = null;
        var currentFlashcardIndex = 0;
        var activeFlashcards = [];
        
        var moduleContentData = {
            'kenal_huruf': {
                flashcards: Array.from({length: 26}, (_, i) => ({front: String.fromCharCode(65 + i), back: String.fromCharCode(97 + i), icon: '⭐'})),
                audioFront: (item) => `Huruf besar ${item.front}`,
                audioBack: (item) => `Huruf kecil ${item.back}`
            },
            'huruf_vokal': {
                flashcards: ['A', 'E', 'I', 'O', 'U'].map(v => ({front: v, back: v.toLowerCase(), icon: '🎵'})),
                audioFront: (item) => `Vokal besar ${item.front}`,
                audioBack: (item) => `Vokal kecil ${item.back}`
            },
            'huruf_konsonan': {
                flashcards: ['B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z'].map(v => ({front: v, back: v.toLowerCase(), icon: '🔹'})),
                audioFront: (item) => `Konsonan besar ${item.front}`,
                audioBack: (item) => `Konsonan kecil ${item.back}`
            },
            'suku_kata_kv': {
                flashcards: [
                    {front: 'ba', back: 'BA', icon: '🔊'}, {front: 'be', back: 'BE', icon: '🔊'}, {front: 'bi', back: 'BI', icon: '🔊'}, {front: 'bo', back: 'BO', icon: '🔊'}, {front: 'bu', back: 'BU', icon: '🔊'},
                    {front: 'ca', back: 'CA', icon: '🔊'}, {front: 'ce', back: 'CE', icon: '🔊'}, {front: 'ci', back: 'CI', icon: '🔊'}, {front: 'co', back: 'CO', icon: '🔊'}, {front: 'cu', back: 'CU', icon: '🔊'},
                    {front: 'da', back: 'DA', icon: '🔊'}, {front: 'de', back: 'DE', icon: '🔊'}, {front: 'di', back: 'DI', icon: '🔊'}, {front: 'do', back: 'DO', icon: '🔊'}, {front: 'du', back: 'DU', icon: '🔊'},
                    {front: 'fa', back: 'FA', icon: '🔊'}, {front: 'fe', back: 'FE', icon: '🔊'}, {front: 'fi', back: 'FI', icon: '🔊'}, {front: 'fo', back: 'FO', icon: '🔊'}, {front: 'fu', back: 'FU', icon: '🔊'},
                    {front: 'ga', back: 'GA', icon: '🔊'}, {front: 'ge', back: 'GE', icon: '🔊'}, {front: 'gi', back: 'GI', icon: '🔊'}, {front: 'go', back: 'GO', icon: '🔊'}, {front: 'gu', back: 'GU', icon: '🔊'},
                    {front: 'ha', back: 'HA', icon: '🔊'}, {front: 'he', back: 'HE', icon: '🔊'}, {front: 'hi', back: 'HI', icon: '🔊'}, {front: 'ho', back: 'HO', icon: '🔊'}, {front: 'hu', back: 'HU', icon: '🔊'},
                    {front: 'ja', back: 'JA', icon: '🔊'}, {front: 'je', back: 'JE', icon: '🔊'}, {front: 'ji', back: 'JI', icon: '🔊'}, {front: 'jo', back: 'JO', icon: '🔊'}, {front: 'ju', back: 'JU', icon: '🔊'},
                    {front: 'ka', back: 'KA', icon: '🔊'}, {front: 'ke', back: 'KE', icon: '🔊'}, {front: 'ki', back: 'KI', icon: '🔊'}, {front: 'ko', back: 'KO', icon: '🔊'}, {front: 'ku', back: 'KU', icon: '🔊'},
                    {front: 'la', back: 'LA', icon: '🔊'}, {front: 'le', back: 'LE', icon: '🔊'}, {front: 'li', back: 'LI', icon: '🔊'}, {front: 'lo', back: 'LO', icon: '🔊'}, {front: 'lu', back: 'LU', icon: '🔊'},
                    {front: 'ma', back: 'MA', icon: '🔊'}, {front: 'me', back: 'ME', icon: '🔊'}, {front: 'mi', back: 'MI', icon: '🔊'}, {front: 'mo', back: 'MO', icon: '🔊'}, {front: 'mu', back: 'MU', icon: '🔊'},
                    {front: 'na', back: 'NA', icon: '🔊'}, {front: 'ne', back: 'NE', icon: '🔊'}, {front: 'ni', back: 'NI', icon: '🔊'}, {front: 'no', back: 'NO', icon: '🔊'}, {front: 'nu', back: 'NU', icon: '🔊'},
                    {front: 'pa', back: 'PA', icon: '🔊'}, {front: 'pe', back: 'PE', icon: '🔊'}, {front: 'pi', back: 'PI', icon: '🔊'}, {front: 'po', back: 'PO', icon: '🔊'}, {front: 'pu', back: 'PU', icon: '🔊'}
                ],
                audioFront: (item) => `${item.front}`,
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kv_kv': {
                flashcards: [
                    {front: 'be - ca', back: 'BECA', icon: '🛺'}, {front: 'ci - ku', back: 'CIKU', icon: '🥔'},
                    {front: 'ja - ri', back: 'JARI', icon: '👉'}, {front: 'ku - ku', back: 'KUKU', icon: '💅'},
                    {front: 'la - bu', back: 'LABU', icon: '🎃'}, {front: 'li - di', back: 'LIDI', icon: '🪵'},
                    {front: 'ma - ta', back: 'MATA', icon: '👁️'}, {front: 'na - si', back: 'NASI', icon: '🍚'},
                    {front: 'pa - ku', back: 'PAKU', icon: '📌'}, {front: 'ra - ga', back: 'RAGA', icon: '🧺'},
                    {front: 'ru - sa', back: 'RUSA', icon: '🦌'}, {front: 'sa - wi', back: 'SAWI', icon: '🥬'},
                    {front: 'su - du', back: 'SUDU', icon: '🥄'}, {front: 'ta - li', back: 'TALI', icon: '🪢'},
                    {front: 'te - bu', back: 'TEBU', icon: '🎋'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_v_kv': {
                flashcards: [
                    {front: 'a - lu', back: 'ALU', icon: '🔨'}, {front: 'a - pi', back: 'API', icon: '🔥'},
                    {front: 'i - bu', back: 'IBU', icon: '👩'}, {front: 'i - si', back: 'ISI', icon: '🥩'},
                    {front: 'u - bi', back: 'UBI', icon: '🥔'}, {front: 'u - lu', back: 'ULU', icon: '⛰️'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kv_kv_kv': {
                flashcards: [
                    {front: 'be - ru - du', back: 'BERUDU', icon: '🐸'}, {front: 'ke - la - di', back: 'KELADI', icon: '🍠'},
                    {front: 'ke - la - pa', back: 'KELAPA', icon: '🥥'}, {front: 'ke - me - ja', back: 'KEMEJA', icon: '👕'},
                    {front: 'ke - re - ta', back: 'KERETA', icon: '🚗'}, {front: 'ke - ru - si', back: 'KERUSI', icon: '🪑'},
                    {front: 'pe - li - ta', back: 'PELITA', icon: '🪔'}, {front: 'pe - ri - gi', back: 'PERIGI', icon: '🕳️'},
                    {front: 'pe - ta - ni', back: 'PETANI', icon: '👨‍🌾'}, {front: 'pe - to - la', back: 'PETOLA', icon: '🥒'},
                    {front: 'se - ma - lu', back: 'SEMALU', icon: '🌱'}, {front: 'se - pa - tu', back: 'SEPATU', icon: '👞'},
                    {front: 'to - ma - to', back: 'TOMATO', icon: '🍅'}, {front: 'wa - ni - ta', back: 'WANITA', icon: '👩'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kvk': {
                flashcards: [
                    {front: 'bas', back: 'BAS', icon: '🚌'}, {front: 'beg', back: 'BEG', icon: '🎒'},
                    {front: 'bot', back: 'BOT', icon: '🚤'}, {front: 'cat', back: 'CAT', icon: '🎨'},
                    {front: 'jag', back: 'JAG', icon: '🥛'}, {front: 'jam', back: 'JAM', icon: '⏰'},
                    {front: 'jem', back: 'JEM', icon: '🍯'}, {front: 'jet', back: 'JET', icon: '✈️'},
                    {front: 'kek', back: 'KEK', icon: '🍰'}, {front: 'kot', back: 'KOT', icon: '🧥'},
                    {front: 'pam', back: 'PAM', icon: '⛽'}, {front: 'pen', back: 'PEN', icon: '🖊️'},
                    {front: 'pil', back: 'PIL', icon: '💊'}, {front: 'pin', back: 'PIN', icon: '📌'},
                    {front: 'rak', back: 'RAK', icon: '🪜'}, {front: 'rim', back: 'RIM', icon: '🛞'},
                    {front: 'ros', back: 'ROS', icon: '🌹'}, {front: 'sup', back: 'SUP', icon: '🍲'},
                    {front: 'tin', back: 'TIN', icon: '🥫'}, {front: 'van', back: 'VAN', icon: '🚐'}
                ],
                audioFront: (item) => `${item.front}`,
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_v_kvk': {
                flashcards: [
                    {front: 'a - yam', back: 'AYAM', icon: '🐔'}, {front: 'e - nam', back: 'ENAM', icon: '6️⃣'},
                    {front: 'e - pal', back: 'EPAL', icon: '🍎'}, {front: 'i - kan', back: 'IKAN', icon: '🐟'},
                    {front: 'i - tik', back: 'ITIK', icon: '🦆'}, {front: 'o - bor', back: 'OBOR', icon: '🔥'},
                    {front: 'o - ren', back: 'OREN', icon: '🍊'}, {front: 'o - tak', back: 'OTAK', icon: '🧠'},
                    {front: 'u - lar', back: 'ULAR', icon: '🐍'}, {front: 'u - lat', back: 'ULAT', icon: '🐛'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kv_kvk': {
                flashcards: [
                    {front: 'ba - kul', back: 'BAKUL', icon: '🧺'}, {front: 'be - lon', back: 'BELON', icon: '🎈'},
                    {front: 'be - ruk', back: 'BERUK', icon: '🐒'}, {front: 'be - tik', back: 'BETIK', icon: '🍈'},
                    {front: 'bo - tol', back: 'BOTOL', icon: '🍾'}, {front: 'ca - wan', back: 'CAWAN', icon: '☕'},
                    {front: 'ce - rek', back: 'CEREK', icon: '🫖'}, {front: 'ga - jah', back: 'GAJAH', icon: '🐘'},
                    {front: 'ge - las', back: 'GELAS', icon: '🥛'}, {front: 'gi - tar', back: 'GITAR', icon: '🎸'},
                    {front: 'ka - pak', back: 'KAPAK', icon: '🪓'}, {front: 'ka - pal', back: 'KAPAL', icon: '🚢'},
                    {front: 'ka - sut', back: 'KASUT', icon: '👞'}, {front: 'ka - til', back: 'KATIL', icon: '🛏️'},
                    {front: 'ke - tam', back: 'KETAM', icon: '🦀'}, {front: 'ki - cap', back: 'KICAP', icon: '🧴'},
                    {front: 'ki - lat', back: 'KILAT', icon: '⚡'}, {front: 'ki - pas', back: 'KIPAS', icon: '💨'},
                    {front: 'li - lin', back: 'LILIN', icon: '🕯️'}, {front: 'ma - kan', back: 'MAKAN', icon: '🍽️'},
                    {front: 'ma - rah', back: 'MARAH', icon: '😠'}, {front: 'na - nas', back: 'NANAS', icon: '🍍'},
                    {front: 'pa - gar', back: 'PAGAR', icon: '🚧'}, {front: 'sa - bun', back: 'SABUN', icon: '🧼'},
                    {front: 'si - kat', back: 'SIKAT', icon: '梳'}, {front: 'ta - yar', back: 'TAYAR', icon: '🛞'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kvk_kv': {
                flashcards: [
                    {front: 'bal - di', back: 'BALDI', icon: '🪣'}, {front: 'ben - di', back: 'BENDI', icon: '🥬'},
                    {front: 'gar - pu', back: 'GARPU', icon: '🍴'}, {front: 'jam - bu', back: 'JAMBU', icon: '🍐'},
                    {front: 'kun - ci', back: 'KUNCI', icon: '🔑'}, {front: 'lam - pu', back: 'LAMPU', icon: '💡'},
                    {front: 'lem - bu', back: 'LEMBU', icon: '🐄'}, {front: 'pin - tu', back: 'PINTU', icon: '🚪'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kvk_kvk': {
                flashcards: [
                    {front: 'bis - kut', back: 'BISKUT', icon: '🍪'}, {front: 'cer - min', back: 'CERMIN', icon: '🪞'},
                    {front: 'cin - cin', back: 'CINCIN', icon: '💍'}, {front: 'dok - tor', back: 'DOKTOR', icon: '👨‍⚕️'},
                    {front: 'man - cis', back: 'MANCIS', icon: '🔥'}, {front: 'mas - jid', back: 'MASJID', icon: '🕌'},
                    {front: 'ram - but', back: 'RAMBUT', icon: '💇'}, {front: 'rum - put', back: 'RUMPUT', icon: '🌿'},
                    {front: 'sam - pah', back: 'SAMPAH', icon: '🗑️'}, {front: 'sam - pan', back: 'SAMPAN', icon: '🛶'},
                    {front: 'tan - duk', back: 'TANDUK', icon: '🦌'}, {front: 'tom - bol', back: 'TOMBOL', icon: '🚪'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kvkk': {
                flashcards: [
                    {front: 'bank', back: 'BANK', icon: '🏦'}, {front: 'gong', back: 'GONG', icon: '🪘'},
                    {front: 'jong', back: 'JONG', icon: '⛵'}, {front: 'tong', back: 'TONG', icon: '🛢️'},
                    {front: 'wang', back: 'WANG', icon: '💵'}, {front: 'zink', back: 'ZINK', icon: '🏗️'}
                ],
                audioFront: (item) => `${item.front}`,
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kv_kv_kvk': {
                flashcards: [
                    {front: 'ba - si - kal', back: 'BASIKAL', icon: '🚲'}, {front: 'ke - la - war', back: 'KELAWAR', icon: '🦇'},
                    {front: 'ke - le - dek', back: 'KELEDEK', icon: '🍠'}, {front: 'ke - tu - pat', back: 'KETUPAT', icon: '🍙'},
                    {front: 'pi - ra - mid', back: 'PIRAMID', icon: '🔺'}, {front: 'pu - la - san', back: 'PULASAN', icon: '🌰'},
                    {front: 'te - le - fon', back: 'TELEFON', icon: '☎️'}, {front: 'te - ti - kus', back: 'TETIKUS', icon: '🖱️'},
                    {front: 'zi - ra - fah', back: 'ZIRAFAH', icon: '🦒'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'suku_kata_kvk_kv_kvk': {
                flashcards: [
                    {front: 'cem - pe - dak', back: 'CEMPEDAK', icon: '🍈'}, {front: 'cen - da - wan', back: 'CENDAWAN', icon: '🍄'},
                    {front: 'jam - ba - tan', back: 'JAMBATAN', icon: '🌉'}, {front: 'kom - pu - ter', back: 'KOMPUTER', icon: '💻'},
                    {front: 'pem - ba - ris', back: 'PEMBARIS', icon: '📏'}, {front: 'tem - pa - yan', back: 'TEMPAYAN', icon: '🏺'}
                ],
                audioFront: (item) => item.front.replace(/\s*-\s*/g, ' '),
                audioBack: (item) => `${item.back}`
            },
            'ayat_mudah': {
                title: 'Ayat Mudah',
                items: [
                    { title: 'Baju Ali', text: 'Ini baju Ali.', icon: '👕' },
                    { title: 'Nasi Ibu', text: 'Ibu masak nasi.', icon: '🍚' },
                    { title: 'Kereta Bapa', text: 'Bapa bawa kereta.', icon: '🚗' },
                    { title: 'Bola Adik', text: 'Adik suka bola.', icon: '⚽' },
                    { title: 'Kucing Saya', text: 'Saya ada kucing.', icon: '🐱' },
                    { title: 'Bunga Kakak', text: 'Kakak beli bunga.', icon: '🌸' },
                    { title: 'Susu Siti', text: 'Siti minum susu.', icon: '🥛' },
                    { title: 'Buku Atok', text: 'Atok baca buku.', icon: '📖' }
                ],
                flashcards: [
                    { front: 'Ini baju Ali.', back: 'Baju Ali', icon: '👕' },
                    { front: 'Ibu masak nasi.', back: 'Nasi Ibu', icon: '🍚' },
                    { front: 'Bapa bawa kereta.', back: 'Kereta Bapa', icon: '🚗' },
                    { front: 'Adik suka bola.', back: 'Bola Adik', icon: '⚽' },
                    { front: 'Saya ada kucing.', back: 'Kucing Saya', icon: '🐱' },
                    { front: 'Kakak beli bunga.', back: 'Bunga Kakak', icon: '🌸' },
                    { front: 'Siti minum susu.', back: 'Susu Siti', icon: '🥛' },
                    { front: 'Atok baca buku.', back: 'Buku Atok', icon: '📖' }
                ]
            },
            'ayat_pendek': {
                title: 'Ayat Pendek',
                items: [
                    { title: 'Baju Baharu', text: 'Ini baju baharu Ali.', icon: '👕' },
                    { title: 'Nasi Goreng', text: 'Ibu masak nasi goreng.', icon: '🍲' },
                    { title: 'Kereta Merah', text: 'Bapa memandu kereta merah.', icon: '🚗' },
                    { title: 'Bermain Bola', text: 'Adik bermain bola di padang.', icon: '⚽' },
                    { title: 'Kucing Comel', text: 'Saya ada kucing yang comel.', icon: '🐱' },
                    { title: 'Membeli Bunga', text: 'Kakak membeli bunga di kedai.', icon: '🌸' },
                    { title: 'Minum Susu', text: 'Siti minum susu setiap pagi.', icon: '🥛' },
                    { title: 'Buku Cerita', text: 'Atok membaca buku cerita.', icon: '📖' }
                ],
                flashcards: [
                    { front: 'Ini baju baharu Ali.', back: 'Baju Baharu', icon: '👕' },
                    { front: 'Ibu masak nasi goreng.', back: 'Nasi Goreng', icon: '🍲' },
                    { front: 'Bapa memandu kereta merah.', back: 'Kereta Merah', icon: '🚗' },
                    { front: 'Adik bermain bola di padang.', back: 'Bermain Bola', icon: '⚽' },
                    { front: 'Saya ada kucing yang comel.', back: 'Kucing Comel', icon: '🐱' },
                    { front: 'Kakak membeli bunga di kedai.', back: 'Membeli Bunga', icon: '🌸' },
                    { front: 'Siti minum susu setiap pagi.', back: 'Minum Susu', icon: '🥛' },
                    { front: 'Atok membaca buku cerita.', back: 'Buku Cerita', icon: '📖' }
                ]
            },
            'ayat_panjang': {
                title: 'Ayat Panjang',
                items: [
                    { title: 'Baju Ke Sekolah', text: 'Ali memakai baju baharu untuk pergi ke sekolah.', icon: '🏫' },
                    { title: 'Nasi Goreng Sedap', text: 'Ibu memasak nasi goreng yang sangat sedap untuk keluarga.', icon: '🍲' },
                    { title: 'Memandu Kereta', text: 'Bapa memandu kereta merah dengan berhati-hati di jalan raya.', icon: '🚗' },
                    { title: 'Bermain Bersama', text: 'Adik bermain bola bersama kawan-kawan di padang permainan.', icon: '⚽' },
                    { title: 'Menjaga Kucing', text: 'Saya menjaga kucing comel ini dengan penuh kasih sayang.', icon: '🐱' },
                    { title: 'Badan Sihat', text: 'Siti rajin minum susu segar setiap pagi supaya badan sihat.', icon: '🥛' }
                ],
                flashcards: [
                    { front: 'Ali memakai baju baharu untuk pergi ke sekolah.', back: 'Baju Ke Sekolah', icon: '🏫' },
                    { front: 'Ibu memasak nasi goreng yang sangat sedap untuk keluarga.', back: 'Nasi Goreng Sedap', icon: '🍲' },
                    { front: 'Bapa memandu kereta merah dengan berhati-hati di jalan raya.', back: 'Memandu Kereta', icon: '🚗' },
                    { front: 'Adik bermain bola bersama kawan-kawan di padang permainan.', back: 'Bermain Bersama', icon: '⚽' },
                    { front: 'Saya menjaga kucing comel ini dengan penuh kasih sayang.', back: 'Menjaga Kucing', icon: '🐱' },
                    { front: 'Siti rajin minum susu segar setiap pagi supaya badan sihat.', back: 'Badan Sihat', icon: '🥛' }
                ]
            },
            'petikan_tahap_1': {
                title: 'Petikan Tahap 1',
                items: [
                    { title: 'Kucing Saya', text: 'Saya ada seekor kucing.\nNama kucing saya Comel.\nBulu Comel berwarna putih dan lembut.\nComel suka makan ikan goreng.\nSaya sangat sayang akan Comel.', icon: '🐱' },
                    { title: 'Hobi Ali', text: 'Ali suka membaca buku.\nPada masa lapang, Ali pergi ke perpustakaan.\nAli membaca buku cerita dan komik.\nMembaca buku menambahkan ilmu pengetahuan Ali.', icon: '📚' },
                    { title: 'Taman Bunga Ibu', text: 'Ibu mempunyai sebuah taman bunga.\nDi taman ibu ada bunga mawar, orkid, dan keembung.\nTaman bunga ibu sangat harum dan indah.\nIbu rajin menyiram bunga setiap hari.', icon: '🌻' }
                ],
                flashcards: [
                    { front: 'Saya ada seekor kucing. Nama kucing saya Comel.', back: 'Kucing Saya', icon: '🐱' },
                    { front: 'Ali suka membaca buku di perpustakaan.', back: 'Hobi Ali', icon: '📚' },
                    { front: 'Ibu mempunyai sebuah taman bunga yang indah.', back: 'Taman Bunga Ibu', icon: '🌻' }
                ]
            },
            'petikan_tahap_2': {
                title: 'Petikan Tahap 2',
                items: [
                    { title: 'Gotong-Royong Di Kampung', text: 'Pada hari Ahad yang lalu, penduduk Kampung Murni mengadakan aktiviti gotong-royong.\nSemua penduduk berkumpul di balai raya.\nMereka membersihkan kawasan longkang dan memotong rumput.\nSelepas selesai, mereka menikmati jamuan bersama-sama.\nKampung mereka menjadi bersih dan indah.', icon: '🧹' },
                    { title: 'Lawatan Ke Zoo', text: 'Pada cuti sekolah, bapa membawa kami sekeluarga melawat ke Zoo Negara.\nDi zoo, kami dapat melihat pelbagai jenis haiwan seperti gajah, singa, harimau, dan zirafah.\nSaya berasa sangat gembira kerana dapat mengambil gambar haiwan-haiwan tersebut.\nLawatan ini sangat menyeronokkan.', icon: '🦁' },
                    { title: 'Hari Sukan Sekolah', text: 'Sekolah Kebangsaan Murni telah mengadakan Hari Sukan Tahunan.\nSemua murid berkumpul di padang dengan penuh semangat.\nTerdapat pelbagai acara seperti lari berpagar, lompat jauh, dan tarik tali.\nRumah Merah telah menjadi johan keseluruhan.\nSemua orang berasa gembira.', icon: '🏆' }
                ],
                flashcards: [
                    { front: 'Penduduk Kampung Murni mengadakan aktiviti gotong-royong.', back: 'Gotong-Royong', icon: '🧹' },
                    { front: 'Bapa membawa kami sekeluarga melawat ke Zoo Negara.', back: 'Lawatan Ke Zoo', icon: '🦁' },
                    { front: 'Sekolah Kebangsaan Murni mengadakan Hari Sukan Tahunan.', back: 'Hari Sukan Sekolah', icon: '🏆' }
                ]
            },
            'cerita_pendek': {
                title: 'Cerita Pendek',
                items: [
                    { title: 'Sang Kancil dan Sang Buaya', text: 'Pada suatu hari, Sang Kancil mahu menyeberang sungai untuk makan buah-buahan yang masak di seberang.\nSungai itu penuh dengan buaya yang lapar.\nSang Kancil mendapat satu akal.\nDia menyuruh semua buaya berbaris dari tebing ke tebing untuk dikira.\nSang Kancil melompat di atas belakang buaya sambil mengira hingga sampai ke seberang.\nSang Kancil bijak dan berjaya menyeberang sungai dengan selamat.', icon: '🦊' },
                    { title: 'Arnab dan Kura-kura', text: 'Arnab yang sombong telah mencabar Kura-kura berlari pantas.\nSemasa perlombaan, Arnab berlari sangat jauh meninggalkan Kura-kura.\nArnab berasa yakin akan menang lalu tertidur di bawah pokok.\nKura-kura terus merangkak tanpa henti dengan gigih.\nAkhirnya, Kura-kura berjaya sampai ke garisan penamat dahulu dan menang dalam perlombaan itu.', icon: '🐢' },
                    { title: 'Semut dan Belalang', text: 'Pada musim panas, Semut rajin mengumpul makanan untuk bekalan musim hujan.\nBelalang hanya bermain muzik dan menyanyi sepanjang hari.\nApabila musim hujan tiba, Belalang kelaparan kerana tiada makanan.\nSemut yang baik hati telah berkongsi makanan dengan Belalang.\nBelalang berjanji akan rajin bekerja pada masa akan datang.', icon: '🐜' }
                ],
                flashcards: [
                    { front: 'Sang Kancil bijak menyeberang sungai yang ada buaya.', back: 'Sang Kancil', icon: '🦊' },
                    { front: 'Kura-kura menang perlombaan kerana gigih merangkak.', back: 'Arnab dan Kura-kura', icon: '🐢' },
                    { front: 'Semut yang rajin membantu Belalang semasa musim hujan.', back: 'Semut dan Belalang', icon: '🐜' }
                ]
            }
        };

        

        var currentListHurufType = '';

function bukaModalPilihJenisHuruf(id) {
    currentModuleId = id;
    if (id === 'kenali_huruf') {
        document.getElementById('modal-pilih-jenis-huruf-title').innerText = "Kenali Huruf";
        document.getElementById('modal-pilih-jenis-huruf').style.display = 'flex';
    } else {
        bukaSenaraiHuruf('kecil');
    }
}

function bukaSenaraiHuruf(jenis) {
    document.getElementById('modal-pilih-jenis-huruf').style.display = 'none';
    currentListHurufType = jenis;
        var title = "";
        var hurufList = [];
    
        var isKecil = jenis === 'kecil';
    
    if (currentModuleId === 'kenali_huruf') {
        title = "Kenali Huruf " + (isKecil ? "Kecil" : "Besar");
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode((isKecil ? 97 : 65) + i));
    } else if (currentModuleId === 'huruf_vokal') {
        title = "Huruf Vokal";
        hurufList = ['a', 'e', 'i', 'o', 'u'];
    } else if (currentModuleId === 'huruf_konsonan') {
        title = "Huruf Konsonan";
        hurufList = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    } else if (currentModuleId === 'fonik_abc') {
        title = "Fonik ABC";
        hurufList = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i));
    }

    document.getElementById('view-belajar-huruf-title').innerText = title;
    
        var container = document.getElementById('grid-huruf-container');
    container.innerHTML = '';
    
    hurufList.forEach(huruf => {
        var btn = document.createElement('button');
        btn.className = 'neo-btn bg-purple btn-huruf-grid';
        btn.innerText = huruf;
        btn.onclick = () => sebutHuruf(huruf, currentModuleId === 'fonik_abc');
        container.appendChild(btn);
    });
    
    paparSkrin('view-belajar-huruf');
    unlockNextBelajar(currentModuleId);
}

function sebutHuruf(huruf, isFonik) {
    if(isFonik) {
        sebutAudio(huruf); 
    } else {
        sebutAudio(huruf);
    }
}

function unlockNextBelajar(id) {
    if (window.currentPeta && window.currentPetaModules) {
        var index = window.currentPetaModules.findIndex(m => m.id === id);
        if (index !== -1) {
            window.sessionBelajarProgress = window.sessionBelajarProgress || {};
            let defaultUnlocked = (window.currentPeta === 1 || window.currentPeta === 4) ? 2 : 0;
            if (window.sessionBelajarProgress[window.currentPeta] === undefined) {
                window.sessionBelajarProgress[window.currentPeta] = defaultUnlocked;
            }
            
            const currentUnlocked = window.sessionBelajarProgress[window.currentPeta];
            if (index >= currentUnlocked) {
                window.sessionBelajarProgress[window.currentPeta] = index + 1;
                bukaPeta(window.currentPeta, true); // Re-render map silently
            }
        }
    }
}

function klikModul(id, title) {

            currentModuleId = id;
            currentModuleTitle = title;
            if(modSemasa === 'belajar') unlockNextBelajar(id);
            
            if(modSemasa === 'belajar') {
                if (['kenali_huruf', 'huruf_vokal', 'huruf_konsonan', 'fonik_abc'].includes(id)) {
                    bukaModalPilihJenisHuruf(id);
                    return;
                }
                
                if (id.startsWith('suku_kata_')) {
                    initBelajarSukuKata(id, title);
                    return;
                }

                if (window.currentPeta === 4 || ['ayat_mudah', 'ayat_pendek', 'ayat_panjang', 'petikan_tahap_1', 'petikan_tahap_2', 'cerita_pendek'].includes(id)) {
                    initBelajarBacaan(id, title);
                    return;
                }

                const topBarTitle = document.querySelector('#murid-menu-belajar .map-top-bar div.neo-btn'); if(topBarTitle) topBarTitle.innerText = title;
                
                const ceritAudioBtn = document.getElementById('btn-cerita-audio');
                const papanSurihBtn = document.getElementById('btn-papan-surih');
                const kotakFonikBtn = document.getElementById('btn-kotak-fonik');
                
                if(ceritAudioBtn) ceritAudioBtn.style.display = 'none';
                if(papanSurihBtn) papanSurihBtn.style.display = 'none';
                if(kotakFonikBtn) kotakFonikBtn.style.display = 'none';

                if(id === 'kenal_huruf' || id === 'huruf_vokal' || id === 'huruf_konsonan') {
                    if(papanSurihBtn) papanSurihBtn.style.display = 'flex';
                    if(kotakFonikBtn) kotakFonikBtn.style.display = 'flex';
                } else {
                    if(ceritAudioBtn) ceritAudioBtn.style.display = 'flex';
                }
                
                const flashcardTitle = document.querySelector('#murid-menu-belajar .learning-primary div.neo-btn');
                if(flashcardTitle) {
                    if(id === 'kenal_huruf' || id === 'huruf_vokal' || id === 'huruf_konsonan') {
                        if(flashcardTitle) flashcardTitle.innerText = "Flashcard Huruf";
                    } else {
                        if(flashcardTitle) flashcardTitle.innerText = "Flashcard Suku Kata";
                    }
                }
                paparSkrin('murid-menu-belajar');
            } else {
                if (window.currentPeta === 1 || window.currentPeta === 2 || window.currentPeta === 3 || window.currentPeta === 4) {
                    const displayTitle = (modSemasa === 'belajar') ? title.replace(/^Cabaran\s+/i, '') : title;
                    const event = new CustomEvent('start-cabaran-suku-kata', { detail: { id: id, title: displayTitle } });
                    window.dispatchEvent(event);
                    paparSkrin('view-cabaran-suku-kata');
                } else {
                    paparSkrin('murid-menu-latihan');
                }
            }
        }
        
        function initBelajarSukuKata(id, title) {
            currentModuleId = id;
            currentModuleTitle = title;
            currentFlashcardIndex = 0;
            const data = moduleContentData[id];
            
            // Set the title
            const titleEl = document.getElementById('belajar-sukukata-title');
            if (titleEl) titleEl.innerText = title;
            
            // Set the type (e.g. "KVK")
            const typeEl = document.getElementById('sukukata-type-title');
            if (typeEl) {
                // Determine type from id or title
                let typeText = "SUKU KATA";
                if (id === 'suku_kata_kv') typeText = "KV";
                else if (id === 'suku_kata_kvk') typeText = "KVK";
                else if (id === 'suku_kata_kv_kv') typeText = "KV + KV";
                else if (id === 'suku_kata_v_kv') typeText = "V + KV";
                else if (id === 'suku_kata_kv_kv_kv') typeText = "KV + KV + KV";
                else if (id === 'suku_kata_v_kvk') typeText = "V + KVK";
                else if (id === 'suku_kata_kv_kvk') typeText = "KV + KVK";
                else if (id === 'suku_kata_kvk_kv') typeText = "KVK + KV";
                else if (id === 'suku_kata_kvk_kvk') typeText = "KVK + KVK";
                else if (id === 'suku_kata_kvkk') typeText = "KVKK";
                else if (id === 'suku_kata_kv_kv_kvk') typeText = "KV + KV + KVK";
                else if (id === 'suku_kata_kvk_kv_kvk') typeText = "KVK + KV + KVK";
                typeEl.innerText = typeText;
            }

            if (data && data.flashcards) {
                activeFlashcards = data.flashcards;
            } else {
                // Fallback dummy data if not implemented yet
                activeFlashcards = [
                    {front: '...', back: '???', icon: '❓'}
                ];
            }
            renderBelajarSukuKata();
            paparSkrin('view-belajar-sukukata');
        }

        
        var flashcardAttentionTimer = null;

        function flipFlashcard(sceneEl) {
            const card = sceneEl.querySelector('.card');
            if(card) {
                card.classList.toggle('is-flipped');
                resetFlashcardAttentionTimer();
                if (window.mainAudioSukuKataSemasa) {
                    window.mainAudioSukuKataSemasa();
                }
            }
        }

        function startFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            flashcardAttentionTimer = setInterval(() => {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen) {
                    const sceneEl = activeScreen.querySelector('.scene');
                    if (sceneEl) {
                        sceneEl.classList.add('attention-pulse-glow');
                        setTimeout(() => sceneEl.classList.remove('attention-pulse-glow'), 1000);
                    }
                }
            }, 5000);
        }

        function resetFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            startFlashcardAttentionTimer();
        }

                function renderBelajarSukuKata() {
            startFlashcardAttentionTimer();
            const card = document.getElementById('sukukata-k3d-card');
            if (card) card.classList.remove('is-flipped');
            
            const item = activeFlashcards[currentFlashcardIndex];
            if (!item) return;

            const formatSukuKata = (text) => {
                let formatted = text;
                if(text.includes('-')) {
                    formatted = text.split('-').map((p, i) => `<span style="color: ${i % 2 === 0 ? 'black' : 'red'};">${p.trim()}</span>`).join('');
                } else {
                    formatted = `<span style="color: black;">${text}</span>`;
                }
                const rawLength = text.replace(/[-\s]/g, '').length;
                if (rawLength >= 9) { return `<span style="font-size: 0.5em; display: inline-block; white-space: nowrap;">${formatted}</span>`; } else if (rawLength >= 7) {
                    return `<span style="font-size: 0.65em; display: inline-block;">${formatted}</span>`;
                } else if (rawLength >= 5) {
                    return `<span style="font-size: 0.85em; display: inline-block;">${formatted}</span>`;
                }
                return formatted;
            };

            const wordEl = document.getElementById('sukukata-word');
            if (wordEl) wordEl.innerHTML = formatSukuKata(item.front);

            const iconEl = document.getElementById('sukukata-card-front-content');
            if (iconEl) iconEl.innerHTML = '<img src="https://i.postimg.cc/TPbGvTHW/Copy-of-BUNYI-KATA-APPS.png" style="width: calc(100% - 6px); height: calc(100% - 6px); object-fit: contain; padding: 13px; border-radius: 12px;" alt="Flashcard"/>'; // Show provided image
            
            const backContentEl = document.getElementById('sukukata-card-back-content');
            if (backContentEl) {
                // Show emoji on the back
                backContentEl.innerHTML = `<div style="font-size: 8rem;">${item.icon || '❓'}</div>`;
            }
            
            sebutAudio(moduleContentData[currentModuleId] && moduleContentData[currentModuleId].audioFront ? moduleContentData[currentModuleId].audioFront(item) : item.front);
        }

        function nextBelajarSukuKata() {
            if (currentFlashcardIndex < activeFlashcards.length - 1) {
                currentFlashcardIndex++;
                renderBelajarSukuKata();
            }
        }

        function prevBelajarSukuKata() {
            if (currentFlashcardIndex > 0) {
                currentFlashcardIndex--;
                renderBelajarSukuKata();
            }
        }
        
        function initFlashcard() {
            currentFlashcardIndex = 0;
            const data = moduleContentData[currentModuleId];
            if(data) {
                activeFlashcards = data.flashcards;
                renderFlashcard();
            } else {
                activeFlashcards = [{front: 'b', back: 'BOLA', icon: '⚽'}];
                renderFlashcard();
            }
        }
        
        function renderFlashcard() {
            startFlashcardAttentionTimer();
            const card = document.getElementById('k3d-card');
            if(card) card.classList.remove('is-flipped');
            
            const item = activeFlashcards[currentFlashcardIndex];
            if(!item) return;
            
            const formatSukuKata = (text) => {
                let formatted = text;
                if(text.includes('-')) {
                    formatted = text.split('-').map((p, i) => `<span style="color: ${i % 2 === 0 ? 'black' : 'red'};">${p.trim()}</span>`).join('');
                } else {
                    formatted = `<span style="color: black;">${text}</span>`;
                }
                const rawLength = text.replace(/[-\s]/g, '').length;
                if (rawLength >= 9) { return `<span style="font-size: 0.5em; display: inline-block; white-space: nowrap;">${formatted}</span>`; } else if (rawLength >= 7) {
                    return `<span style="font-size: 0.65em; display: inline-block;">${formatted}</span>`;
                } else if (rawLength >= 5) {
                    return `<span style="font-size: 0.85em; display: inline-block;">${formatted}</span>`;
                }
                return formatted;
            };

            const faceFront = document.querySelector('.card__face .card-text-big');
            if(faceFront) faceFront.innerHTML = formatSukuKata(item.front);
            
            const faceBackIcon = document.querySelector('.card__face--back div:first-child');
            const faceBackText = document.querySelector('.card__face--back div:last-child');
            
            if(faceBackIcon) faceBackIcon.innerText = item.icon;
            if(faceBackText) faceBackText.innerText = item.back;
            
            sebutAudio(moduleContentData[currentModuleId] ? moduleContentData[currentModuleId].audioFront(item) : item.front);
        }
        
        function nextFlashcard() {
            if(currentFlashcardIndex < activeFlashcards.length - 1) {
                currentFlashcardIndex++;
                renderFlashcard();
            }
        }
        function prevFlashcard() {
            if(currentFlashcardIndex > 0) {
                currentFlashcardIndex--;
                renderFlashcard();
            }
        }
        
        function flipCardAndSync() {
            resetFlashcardAttentionTimer();
            const card = document.getElementById('k3d-card');
            if(!card) return;
            const isFlipped = card.classList.toggle('is-flipped');
            
            const item = activeFlashcards[currentFlashcardIndex];
            if(item) {
                if(isFlipped) {
                    sebutAudio(moduleContentData[currentModuleId] ? moduleContentData[currentModuleId].audioBack(item) : item.back);
                } else {
                    sebutAudio(moduleContentData[currentModuleId] ? moduleContentData[currentModuleId].audioFront(item) : item.front);
                }
            }
            logProgress('kad');
        }


        // --- TITIK PANDUAN SURIH HURUF ---
        var traceIsDragging = false;
        var traceTargetLetter = 'Aa';
        var traceCurrentPolyline = null;

        function setTraceLetter(letter) {
            document.querySelectorAll('.trace-letter-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = Array.from(document.querySelectorAll('.trace-letter-btn')).find(b => b.innerText === letter);
            if(activeBtn) activeBtn.classList.add('active');
            
            traceTargetLetter = letter.toUpperCase() + letter.toLowerCase();
            const textEl = document.getElementById('trace-svg-text');
            if (textEl) {
                textEl.textContent = traceTargetLetter;
                textEl.style.stroke = '#cbd5e1'; 
            }
            clearFreehandTracing();
        }

        function initTraceLetters() {
            const tabs = document.getElementById('trace-letter-tabs');
            if (!tabs) return;
            tabs.innerHTML = '';
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            letters.forEach(letter => {
                const btn = document.createElement('button');
                btn.className = 'neo-btn bg-white trace-letter-btn';
                btn.innerText = letter;
                btn.onclick = () => {
                    sebutAudio(letter);
                    setTraceLetter(letter);
                };
                tabs.appendChild(btn);
            });
        }

        function getSvgCoords(svg, evt) {
            let pt = svg.createSVGPoint();
            pt.x = evt.clientX;
            pt.y = evt.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        }

        window.startFreehandTrace = function(event) {
            event.preventDefault();
            traceIsDragging = true;
            const svg = document.getElementById('trace-svg-canvas');
            svg.setPointerCapture(event.pointerId);
            
            const pt = getSvgCoords(svg, event);
            
            traceCurrentPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            traceCurrentPolyline.setAttribute('fill', 'none');
            traceCurrentPolyline.setAttribute('stroke', 'var(--color-orange)');
            traceCurrentPolyline.setAttribute('stroke-width', '30');
            traceCurrentPolyline.setAttribute('stroke-linecap', 'round');
            traceCurrentPolyline.setAttribute('stroke-linejoin', 'round');
            traceCurrentPolyline.setAttribute('points', `${pt.x},${pt.y}`);
            
            document.getElementById('trace-user-strokes').appendChild(traceCurrentPolyline);
        };

        window.moveFreehandTrace = function(event) {
            if (!traceIsDragging || !traceCurrentPolyline) return;
            event.preventDefault();
            const svg = document.getElementById('trace-svg-canvas');
            const pt = getSvgCoords(svg, event);
            
            let pts = traceCurrentPolyline.getAttribute('points');
            pts += ` ${pt.x},${pt.y}`;
            traceCurrentPolyline.setAttribute('points', pts);
        };

        document.addEventListener('pointerup', (e) => {
            if (traceIsDragging) {
                traceIsDragging = false;
                const svg = document.getElementById('trace-svg-canvas');
                if (svg && svg.hasPointerCapture(e.pointerId)) {
                    svg.releasePointerCapture(e.pointerId);
                }
            }
        });

        window.clearFreehandTracing = function() {
            const strokes = document.getElementById('trace-user-strokes');
            if (strokes) strokes.innerHTML = '';
            const textEl = document.getElementById('trace-svg-text');
            if (textEl) {
                textEl.style.stroke = '#cbd5e1';
                textEl.style.fill = 'none';
            }
            updateProgressBar('pb-latihan-1', 0);
        };

        window.finishFreehandTracing = function() {
            const strokes = document.getElementById('trace-user-strokes');
            if (!strokes || strokes.children.length === 0) {
                sebutAudio("Sila surih huruf dahulu.");
                return;
            }
            
            // Animasi hijau
            const textEl = document.getElementById('trace-svg-text');
            if (textEl) {
                textEl.style.stroke = 'var(--color-green)';
            }
            Array.from(strokes.children).forEach(path => {
                path.setAttribute('stroke', 'var(--color-green)');
            });
            
            updateProgressBar("pb-latihan-1", 100);
            sebutAudio(`Bagus! Anda berjaya menyurih huruf ${traceTargetLetter}.`);
            logProgress('surih', 'belajar');
            logProgress('surihHuruf', 'latihan', 10, 'surihHuruf');
            
            setTimeout(() => {
                triggerSuccessAnimation("Rekod dihantar kepada Cikgu.", () => paparSkrin('murid-menu-latihan'), () => navigate('latihan-1'));
            }, 1000);
        };

        function salahBelon(el) {
            triggerErrorAnimation(el);
            el.style.backgroundColor = "var(--color-red)"; el.innerText = "X";
            setTimeout(() => el.style.display = "none", 500); sebutAudio("Salah");
        }
        function betulBelon(el) {
            updateProgressBar("pb-latihan-3", 100);
            el.style.transform = "scale(1.5)"; el.innerText = "💥";
            sebutAudio("Tahniah!");
            logProgress('belon', 'latihan', 10, 'belon'); // Hantar ke Mod Guru
            el.style.display = "none";
            triggerSuccessAnimation("Tahniah! Anda berjaya meletupkan belon BOT!", () => paparSkrin('murid-menu-latihan'), () => { if(window.initBelon) window.initBelon(); });
        }

        var kesilapanEjaan = 0;
        var puzzleSukuKata = ["la", "bu"];
        var puzzleAnswer = "la bu";
        var puzzleIcon = "🎃";
        function initPuzzleEjaan() {
            puzzleSukuKata = ["la", "bu"];
            puzzleAnswer = "la bu";
            puzzleIcon = "🎃";
            
            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards;
                let wordWithDashes = cards[0].front;
                if(wordWithDashes.includes('-')) {
                    puzzleSukuKata = wordWithDashes.split('-').map(s => s.trim());
                    puzzleAnswer = puzzleSukuKata.join(" ");
                    puzzleIcon = cards[0].icon || '❓';
                }
            }

            const saved = getAutoSave('puzzle') || {s1: "", s2: ""};
            kesilapanEjaan = 0;
            
            const imgBox = document.querySelector('#view-latihan-4 .exercise-image-box');
            if (imgBox) imgBox.innerText = puzzleIcon;
            
            if(document.getElementById('slot-1')) document.getElementById('slot-1').innerText = saved.s1;
            if(document.getElementById('slot-2')) document.getElementById('slot-2').innerText = saved.s2;
            ['1', '2'].forEach(n => {
                const s = document.getElementById('slot-'+n);
                if(s.innerText) s.classList.add('filled'); else s.classList.remove('filled');
            });
            
            const optContainer = document.querySelector('#view-latihan-4 .options-container');
            if (optContainer) {
                let shuffled = [...puzzleSukuKata];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                optContainer.innerHTML = shuffled.map((s, idx) => `<button class="neo-btn bg-${idx % 2 === 0 ? 'blue' : 'red'} option-btn" id="btn-${s}" onclick="pilihSukuKata('${s}', this)">${s}</button>`).join('');
            }
            
            document.querySelectorAll('.option-btn').forEach(b => {
                b.style.opacity = '1'; b.style.pointerEvents = 'auto'; b.classList.remove('hint-active');
            });
            if(saved.s1) { const b = document.getElementById('btn-'+saved.s1); if(b) { b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; } }
            if(saved.s2) { const b = document.getElementById('btn-'+saved.s2); if(b) { b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; } }
            
            let f1=0; if(document.getElementById("slot-1").innerText) f1++; if(document.getElementById("slot-2").innerText) f1++; updateProgressBar("pb-latihan-4", (f1/puzzleSukuKata.length)*100);
        }
        function pilihSukuKata(sk, btnEl) {
            const s1 = document.getElementById('slot-1'); const s2 = document.getElementById('slot-2');
            if(s1.innerText === "") { s1.innerText = sk; s1.classList.add('filled'); btnEl.style.opacity = '0.5'; btnEl.style.pointerEvents = 'none'; }
            else if(s2.innerText === "") { s2.innerText = sk; s2.classList.add('filled'); btnEl.style.opacity = '0.5'; btnEl.style.pointerEvents = 'none'; }
            setAutoSave('puzzle', {s1: s1.innerText, s2: s2.innerText});
            
            let f2=0; if(document.getElementById("slot-1").innerText) f2++; if(document.getElementById("slot-2").innerText) f2++; updateProgressBar("pb-latihan-4", (f2/puzzleSukuKata.length)*100);
        }
        function clearSlot(el) {
            const val = el.innerText; el.innerText = ""; el.classList.remove('filled');
            if(val) { const btn = document.getElementById('btn-'+val); if(btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; } }
            setAutoSave('puzzle', {s1: document.getElementById('slot-1').innerText, s2: document.getElementById('slot-2').innerText});
            
            let f3=0; if(document.getElementById("slot-1").innerText) f3++; if(document.getElementById("slot-2").innerText) f3++; updateProgressBar("pb-latihan-4", (f3/puzzleSukuKata.length)*100);
        }
        function sahkanEjaan() {
            const v1 = document.getElementById('slot-1').innerText; const v2 = document.getElementById('slot-2').innerText;
            if(v1 + " " + v2 === puzzleAnswer) {
                clearAutoSave('puzzle');
                sebutAudio("Hebat! Anda dapat 3 bintang!");
                logProgress('puzzle', 'latihan', 10, 'puzzle'); // Hantar rekod
                triggerSuccessAnimation("Tepat Sekali! Rekod anda dihantar kepada cikgu.", () => {
                    clearSlot(document.getElementById('slot-1')); clearSlot(document.getElementById('slot-2'));
                    kesilapanEjaan = 0; document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('hint-active'));
                    paparSkrin('murid-menu-latihan');
                }, () => navigate('latihan-4'));
            } else {
                kesilapanEjaan++; sebutAudio("Cuba susun semula.");
                triggerErrorAnimation(document.getElementById('slot-1'));
                triggerErrorAnimation(document.getElementById('slot-2'));
                setTimeout(() => {
                    clearSlot(document.getElementById('slot-1')); clearSlot(document.getElementById('slot-2'));
                }, 400);
                if(kesilapanEjaan >= 2) {
                    sebutAudio("Mari cikgu tolong. Cari yang berkelip.");
                    const btnLa = document.getElementById('btn-la'); if(btnLa) btnLa.classList.add('hint-active');
                    const btnBu = document.getElementById('btn-bu'); if(btnBu) btnBu.classList.add('hint-active');
                }
            }
        }

        // --- CARI KATA ---
        var carikataLetters = ['b','y','h','w','c','r','u','s','a','y','x','f','k','g','l','i'];
        var carikataTarget = ['r','u','s','a'];
        var carikataSelected = [];
        var carikataAnswerStr = "rusa";

        function initCariKata() {
            carikataTarget = ['r','u','s','a'];
            carikataAnswerStr = "rusa";
            
            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards;
                let wordWithDashes = cards[0].front;
                let word = wordWithDashes.replace(/-/g, '').toLowerCase().trim();
                if (word.length <= 16) {
                    carikataTarget = word.split('');
                    carikataAnswerStr = word;
                }
            }

            carikataLetters = [];
            for (let i = 0; i < 16; i++) {
                carikataLetters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
            }
            
            // Embed the target word randomly in the grid
            let maxStartIndex = 16 - carikataTarget.length;
            let startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
            for (let i = 0; i < carikataTarget.length; i++) {
                carikataLetters[startIndex + i] = carikataTarget[i];
            }

            const grid = document.getElementById('carikata-grid');
            if(!grid) return;
            const saved = getAutoSave('carikata') || [];
            carikataSelected = [...saved];
            
            grid.innerHTML = carikataLetters.map((l, index) => {
                return `<button class="neo-btn" data-index="${index}" onclick="pilihHurufCariKata(this, '${l}')">${l}</button>`
            }).join('');
            
            let matchCount = 0;
            document.querySelectorAll('.carikata-grid .neo-btn').forEach(btn => {
                if(matchCount < saved.length && btn.innerText === saved[matchCount]) {
                    btn.classList.add('found');
                    matchCount++;
                }
            });
        }

        function pilihHurufCariKata(btn, huruf) {
            if (btn.classList.contains('found')) return;
            const expected = carikataTarget[carikataSelected.length];
            if (huruf === expected) {
                btn.classList.add('found');
                carikataSelected.push(huruf);
                setAutoSave('carikata', carikataSelected);
                sebutAudio(huruf);
                if (carikataSelected.length === carikataTarget.length) {
                    clearAutoSave('carikata');
                    logProgress('carikata', 'latihan', 10, 'carikata');
                    sebutAudio('Tahniah! Anda berjaya.');
                    triggerSuccessAnimation(`Tahniah! Anda jumpa perkataan ${carikataAnswerStr.toUpperCase()}.`, () => paparSkrin('murid-menu-latihan'), () => navigate('latihan-carikata'));
                }
            } else {
                sebutAudio('Cuba lagi');
                triggerErrorAnimation(btn);
                btn.style.backgroundColor = 'var(--color-red)';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 500);
                carikataSelected = [];
                document.querySelectorAll('.carikata-grid .neo-btn').forEach(b => b.classList.remove('found'));
            }
        }

        // --- TARIK GARISAN ---
        var tarikgarisLeft = null;
        var tarikgarisRight = null;
        var tarikgarisTempLine = null;
        var tarikgarisMatches = { 'li': 'di', 'su': 'du', 'ta': 'li' };

        function initTarikGaris() {
            tarikgarisLeft = null;
            tarikgarisRight = null;
            
            tarikgarisMatches = { 'li': 'di', 'su': 'du', 'ta': 'li' };
            let leftSyllables = ['li', 'su', 'ta'];
            let rightSyllables = ['di', 'du', 'li'];
            
            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards.filter(c => c.front.includes('-'));
                if (cards.length >= 3) {
                    tarikgarisMatches = {};
                    leftSyllables = [];
                    rightSyllables = [];
                    for(let i=0; i<3; i++) {
                        let parts = cards[i].front.split('-').map(s => s.trim());
                        if (parts.length >= 2) {
                            tarikgarisMatches[parts[0]] = parts[1];
                            leftSyllables.push(parts[0]);
                            rightSyllables.push(parts[1]);
                        }
                    }
                }
            }
            
            // Set left and right syllables dynamically
            const leftCol = document.getElementById('tarikgaris-left');
            const rightCol = document.getElementById('tarikgaris-right');
            if (leftCol && rightCol) {
                leftCol.innerHTML = leftSyllables.map(s => `<button class="neo-btn tarikgaris-btn" onpointerdown="mulaTarikGarisan(this, event)">${s}</button>`).join('');
                
                let shuffledRight = [...rightSyllables];
                for (let i = shuffledRight.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledRight[i], shuffledRight[j]] = [shuffledRight[j], shuffledRight[i]];
                }
                
                rightCol.innerHTML = shuffledRight.map(s => `<button class="neo-btn tarikgaris-btn" onpointerup="tamatTarikGarisan(this, event)">${s}</button>`).join('');
            }

            const saved = getAutoSave('tarikgaris') || [];
            document.querySelectorAll('.tarikgaris-btn').forEach(b => {
                b.classList.remove('selected', 'matched');
                if(saved.includes(b.innerText.toLowerCase())) {
                    b.classList.add('matched');
                }
            });
            const svg = document.getElementById('tarikgaris-svg');
            if(svg) svg.innerHTML = '';
        }

        function linePoint(btn) {
            const board = document.getElementById('tarikgaris-board').getBoundingClientRect();
            const rect = btn.getBoundingClientRect();
            return { x: rect.left - board.left + rect.width / 2, y: rect.top - board.top + rect.height / 2 };
        }

        function mulaTarikGarisan(btn, event) {
            if(btn.classList.contains('matched')) return;
            event.preventDefault();
            tarikgarisLeft = btn;
            btn.classList.add('selected');
            const svg = document.getElementById('tarikgaris-svg');
            const point = linePoint(btn);
            tarikgarisTempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tarikgarisTempLine.setAttribute('x1', point.x); tarikgarisTempLine.setAttribute('y1', point.y);
            tarikgarisTempLine.setAttribute('x2', point.x); tarikgarisTempLine.setAttribute('y2', point.y);
            tarikgarisTempLine.classList.add('drag-line');
            svg.appendChild(tarikgarisTempLine);
            document.addEventListener('pointermove', gerakTarikGarisan);
            document.addEventListener('pointerup', batalTarikGarisan, { once: true });
        }

        function gerakTarikGarisan(event) {
            if(!tarikgarisTempLine) return;
            const board = document.getElementById('tarikgaris-board').getBoundingClientRect();
            tarikgarisTempLine.setAttribute('x2', event.clientX - board.left);
            tarikgarisTempLine.setAttribute('y2', event.clientY - board.top);
        }

        function tamatTarikGarisan(btn, event) {
            if(!tarikgarisLeft || btn.classList.contains('matched')) return;
            event.preventDefault();
            tarikgarisRight = btn;
            const leftVal = tarikgarisLeft.innerText.toLowerCase();
            const rightVal = tarikgarisRight.innerText.toLowerCase();
            if(tarikgarisMatches[leftVal] === rightVal) {
                tarikgarisLeft.classList.add('matched'); tarikgarisRight.classList.add('matched');
                tarikgarisLeft.classList.remove('selected');
                tambahGarisan(tarikgarisLeft, tarikgarisRight, 'match-line');
                const saved = getAutoSave('tarikgaris') || [];
                saved.push(leftVal, rightVal); setAutoSave('tarikgaris', saved);
                sebutAudio('Betul! ' + leftVal + rightVal);
                if(document.querySelectorAll('#tarikgaris-left .matched').length === 3) {
                    clearAutoSave('tarikgaris'); logProgress('tarikgaris', 'latihan', 10, 'tarikgaris');
                    triggerSuccessAnimation('Tahniah! Lencana Penghubung diperoleh!', () => paparSkrin('murid-menu-latihan'), () => navigate('latihan-tarikgaris'));
                }
            } else {
                triggerErrorAnimation(tarikgarisLeft); triggerErrorAnimation(tarikgarisRight); sebutAudio('Cuba lagi');
                tarikgarisLeft.classList.remove('selected');
            }
            batalTarikGarisan();
        }

        function tambahGarisan(left, right, className) {
            const svg = document.getElementById('tarikgaris-svg');
            if(!svg) return;
            const a = linePoint(left); const b = linePoint(right);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', a.x); line.setAttribute('y1', a.y); line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
            line.classList.add(className); svg.appendChild(line);
        }

        function batalTarikGarisan() {
            document.removeEventListener('pointermove', gerakTarikGarisan);
            if(tarikgarisTempLine) tarikgarisTempLine.remove();
            tarikgarisTempLine = null;
            if(tarikgarisLeft && !tarikgarisLeft.classList.contains('matched')) tarikgarisLeft.classList.remove('selected');
            tarikgarisLeft = null; tarikgarisRight = null;
        }

        // --- KUIZ AUDIO ---
        var kuizAudioWord = "Mata";
        var kuizAudioOptions = ["cu + ku", "ma + ta", "ra + ga"];
        var kuizAudioCorrectIndex = 1;
        
        function initKuizAudio() {
            kuizAudioWord = "Mata";
            kuizAudioOptions = ["cu + ku", "ma + ta", "ra + ga"];
            kuizAudioCorrectIndex = 1;

            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards;
                let wordWithDashes = cards[0].front;
                kuizAudioWord = wordWithDashes.replace(/-/g, '').trim();
                
                let fake1 = "ba + tu";
                let fake2 = "la + bu";
                if (cards.length > 2) {
                    fake1 = cards[1].front.replace(/-/g, ' + ');
                    fake2 = cards[2].front.replace(/-/g, ' + ');
                }
                
                let correctOpt = wordWithDashes.replace(/-/g, ' + ');
                kuizAudioOptions = [fake1, correctOpt, fake2];
                // Shuffle
                for (let i = kuizAudioOptions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [kuizAudioOptions[i], kuizAudioOptions[j]] = [kuizAudioOptions[j], kuizAudioOptions[i]];
                }
                kuizAudioCorrectIndex = kuizAudioOptions.indexOf(correctOpt);
            }
            
            const container = document.getElementById('kuizaudio-container');
            if (container) {
                container.innerHTML = `
                    <button class="neo-btn bg-orange audio-play-btn" onclick="mainAudioKuiz()" aria-label="Dengar audio"><i class="fa-solid fa-volume-high"></i></button>
                    <div class="kuizaudio-options">
                        ${kuizAudioOptions.map((opt, i) => `<button class="neo-btn" onclick="semakKuizAudio(this, ${i === kuizAudioCorrectIndex})">${opt}</button>`).join('')}
                    </div>
                `;
            }
        }

        function mainAudioKuiz() {
            sebutAudio(kuizAudioWord);
        }

        function semakKuizAudio(btn, isCorrect) {
            if (isCorrect) {
                btn.style.backgroundColor = 'var(--color-green)';
                btn.style.color = 'white';
                btn.classList.add('correct-glow');
                sebutAudio(`Tepat sekali! ${kuizAudioWord}.`);
                logProgress('kuizaudio', 'latihan', 10, 'kuizaudio');
                triggerSuccessAnimation('Tahniah! Lencana Telinga Lintah diperoleh!', () => {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.classList.remove('correct-glow');
                    paparSkrin('murid-menu-latihan');
                }, () => {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.classList.remove('correct-glow');
                    navigate('latihan-kuizaudio');
                });
            } else {
                triggerErrorAnimation(btn);
                btn.style.backgroundColor = 'var(--color-red)';
                btn.style.color = 'white';
                sebutAudio('Cuba dengar lagi');
                setTimeout(() => {
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 400);
            }
        }

        // --- SUSUN KATA ---
        var susunKataWord = ["te", "bu"];
        var susunKataAnswer = "tebu";
        function initSusunKata() {
            susunKataWord = ["te", "bu"];
            susunKataAnswer = "tebu";
            
            if (currentModuleId && moduleContentData[currentModuleId] && moduleContentData[currentModuleId].flashcards) {
                let cards = moduleContentData[currentModuleId].flashcards.filter(c => c.front.includes('-'));
                if (cards.length > 0) {
                    let parts = cards[0].front.split('-').map(s => s.trim());
                    if (parts.length >= 2) {
                        susunKataWord = parts;
                        susunKataAnswer = parts.join("");
                    }
                }
            }

            const saved = getAutoSave('susunkata') || {};
            
            // Render slot and block container dynamically
            const container = document.querySelector('#view-latihan-susunkata .susunkata-container');
            if (container) {
                let slotsHTML = susunKataWord.map((_, i) => `<button id="susunkata-slot-${i+1}" class="susunkata-slot" onclick="buangSusunKata(${i+1})">?</button>`).join('');
                
                let shuffled = [...susunKataWord];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                
                let blocksHTML = shuffled.map(s => `<button class="neo-btn susunkata-block" id="susunkata-btn-${s}" onclick="pilihSusunKata('${s}', this)">${s}</button>`).join('');
                
                container.innerHTML = `
                    <div class="susunkata-slots">${slotsHTML}</div>
                    <div class="susunkata-blocks">${blocksHTML}</div>
                    <button class="neo-btn bg-green" onclick="semakSusunKata()"><i class="fa-solid fa-check"></i> Semak</button>
                `;
            }

            susunKataWord.forEach((_, i) => {
                const sEl = document.getElementById(`susunkata-slot-${i+1}`);
                if (sEl) {
                    if (saved[`s${i+1}`]) {
                        sEl.innerText = saved[`s${i+1}`];
                        if (saved[`s${i+1}`] !== "?") sEl.classList.add('filled');
                    } else {
                        sEl.innerText = "?";
                        sEl.classList.remove('filled');
                    }
                }
            });
            
            susunKataWord.forEach(sk => {
                const btn = document.getElementById(`susunkata-btn-${sk}`);
                if (btn) {
                    let isUsed = false;
                    for(let i=0; i<susunKataWord.length; i++) {
                        if (saved[`s${i+1}`] === sk) isUsed = true;
                    }
                    btn.style.opacity = isUsed ? '0.5' : '1';
                    btn.style.pointerEvents = isUsed ? 'none' : 'auto';
                }
            });
        }

        function pilihSusunKata(sk, btnEl) {
            let placed = false;
            let currentSaved = {};
            for(let i=1; i<=susunKataWord.length; i++) {
                const sEl = document.getElementById(`susunkata-slot-${i}`);
                if (!placed && sEl && sEl.innerText === "?") {
                    sEl.innerText = sk;
                    sEl.classList.add('filled');
                    btnEl.style.opacity = '0.5';
                    btnEl.style.pointerEvents = 'none';
                    placed = true;
                }
                currentSaved[`s${i}`] = sEl ? sEl.innerText : "?";
            }
            if (placed) setAutoSave('susunkata', currentSaved);
        }

        function buangSusunKata(slotNum) {
            const slot = document.getElementById(`susunkata-slot-${slotNum}`);
            const val = slot.innerText;
            if (val !== '?') {
                slot.innerText = "?";
                slot.classList.remove('filled');
                const btn = document.getElementById(`susunkata-btn-${val}`);
                if(btn) {
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }
            }
            let currentSaved = {};
            for(let i=1; i<=susunKataWord.length; i++) {
                const sEl = document.getElementById(`susunkata-slot-${i}`);
                currentSaved[`s${i}`] = sEl ? sEl.innerText : "?";
            }
            setAutoSave('susunkata', currentSaved);
        }

        function semakSusunKata() {
            let combined = "";
            for(let i=1; i<=susunKataWord.length; i++) {
                const sEl = document.getElementById(`susunkata-slot-${i}`);
                if (sEl) combined += sEl.innerText;
            }
            
            if (combined === susunKataAnswer) {
                clearAutoSave('susunkata');
                sebutAudio('Hebat! Tebu.');
                logProgress('susunkata', 'latihan', 10, 'susunkata');
                triggerSuccessAnimation('Tahniah! Lencana Arkitek Kata diperoleh!', () => paparSkrin('murid-menu-latihan'), () => navigate('latihan-susunkata'));
            } else {
                sebutAudio('Susunan salah, cuba lagi');
                triggerErrorAnimation(document.getElementById('susunkata-slot-1'));
                triggerErrorAnimation(document.getElementById('susunkata-slot-2'));
                setTimeout(() => {
                    buangSusunKata(1);
                    buangSusunKata(2);
                }, 400);
            }
        }

        // --- THEME TOGGLE ---
        var themes = ['', 'dark-mode', 'theme-pink', 'theme-green', 'theme-blue'];
        var themeNames = ['Terang', 'Gelap', 'Merah Jambu', 'Hijau', 'Biru'];
        var themeIcons = ['fa-moon', 'fa-sun', 'fa-palette', 'fa-leaf', 'fa-water'];
        var currentThemeIndex = 0;

        function toggleTheme() {
            if (themes[currentThemeIndex]) {
                document.body.classList.remove(themes[currentThemeIndex]);
            }
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            if (themes[currentThemeIndex]) {
                document.body.classList.add(themes[currentThemeIndex]);
            }
            localStorage.setItem('bunyiKataTheme', currentThemeIndex.toString());
            document.getElementById('theme-icon').className = "fa-solid " + themeIcons[currentThemeIndex];
            // sebutAudio("Tema " + themeNames[currentThemeIndex]);
            if(document.getElementById('profile-screen').classList.contains('active')) renderProfile();
        }
        
        // Initialize Theme
        var savedTheme = localStorage.getItem('bunyiKataTheme');
        if (savedTheme !== null) {
            currentThemeIndex = parseInt(savedTheme);
            if (themes[currentThemeIndex]) {
                document.body.classList.add(themes[currentThemeIndex]);
            }
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) themeIcon.className = "fa-solid " + themeIcons[currentThemeIndex];
        } else if (localStorage.getItem('bunyiKataDarkMode') === 'true') {
            // fallback for old settings
            currentThemeIndex = 1;
            document.body.classList.add('dark-mode');
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) themeIcon.className = "fa-solid " + themeIcons[currentThemeIndex];
            localStorage.setItem('bunyiKataTheme', '1');
        }

        function initKotakFonik() {
            const grid = document.getElementById('fonik-grid');
            if(!grid) return;
            grid.innerHTML = Array.from({length: 26}, (_, i) => {
                const letter = String.fromCharCode(97 + i);
                return `<button type="button" class="neo-btn fonik-tile" onclick="dengarFonik('${letter}', this)">${letter}</button>`;
            }).join('');
        }

        function dengarFonik(letter, tile) {
            tile.classList.add('is-playing');
            setTimeout(() => tile.classList.remove('is-playing'), 160);
            sebutAudio(`${letter}. bunyi huruf ${letter}`);
            logProgress('kotak');
        }

        function initCeritaAudio() {
            const storyBox = document.querySelector('#view-learn-2 .story-box');
            if(!storyBox) return;
            
            if(currentModuleId === 'suku_kata_kv') {
                storyBox.innerHTML = `Satu hari, <span class="highlight-word" id="w1" onclick="sebutAudioHighlight('Bapa', 'w1'); logProgress('cerita');">Ba pa</span> pergi ke kedai beli <span class="highlight-word" id="w2" onclick="sebutAudioHighlight('Baju', 'w2'); logProgress('cerita');">ba ju</span>.`;
            } else if(currentModuleId === 'suku_kata_kvk') {
                storyBox.innerHTML = `Ibu beli <span class="highlight-word" id="w1" onclick="sebutAudioHighlight('Beg', 'w1'); logProgress('cerita');">Beg</span> dan <span class="highlight-word" id="w2" onclick="sebutAudioHighlight('Mop', 'w2'); logProgress('cerita');">Mop</span>.`;
            } else {
                storyBox.innerHTML = `Satu hari, <span class="highlight-word" id="w1" onclick="sebutAudioHighlight('Ali', 'w1'); logProgress('cerita');">Ali</span> pergi ke kedai beli <span class="highlight-word" id="w2" onclick="sebutAudioHighlight('buku', 'w2'); logProgress('cerita');">buku</span>.`;
            }
        }

        // --- SISTEM BANTUAN (TOOLTIP/MODAL) ---
        function paparBantuan(teks) {
            const modal = document.getElementById('modal-bantuan');
            const teksEl = document.getElementById('teks-bantuan');
            if(modal && teksEl) {
                teksEl.innerText = teks;
                modal.style.display = 'flex';
                sebutAudio("Bantuan. " + teks);
            }
        }
        function tutupBantuan() {
            const modal = document.getElementById('modal-bantuan');
            if(modal) modal.style.display = 'none';
        }


function muatTurunSijil() {
    if(document.getElementById('sijil-btn').disabled) return;
    alert("Tahniah! Anda telah berjaya menyelesaikan semua modul dan lencana.\nSijil anda sedang dimuat turun...");
}

        // Global event listeners
        setTimeout(() => {
            const btnEditProfil = document.getElementById('btn-edit-profil');
            if (btnEditProfil) {
                btnEditProfil.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.bukaModalAvatar) {
                        window.bukaModalAvatar();
                    }
                });
            }
        });

        // --- SISTEM SENARAI SUKU KATA ---
        window.bukaModalSenaraiSukuKata = function() {
            const grid = document.getElementById('senarai-sukukata-grid');
            if(!grid) return;
            grid.innerHTML = '';
            
            activeFlashcards.forEach((item, index) => {
                const btn = document.createElement('div');
                btn.className = 'neo-box';
                btn.style.cssText = 'background: #e0f2fe; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; text-align: center; gap: 10px; transition: transform 0.2s; border-radius: 15px; border: 3px solid var(--color-dark); box-shadow: 4px 4px 0px rgba(0,0,0,0.1);';
                btn.onclick = () => {
                    currentFlashcardIndex = index;
                    renderBelajarSukuKata();
                    tutupModalSenaraiSukuKata();
                };
                btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
                btn.onmouseout = () => btn.style.transform = 'scale(1)';
                
                const iconEl = document.createElement('div');
                iconEl.style.fontSize = '3rem';
                iconEl.style.lineHeight = '1';
                iconEl.innerHTML = item.icon ? item.icon : '<img src="https://i.postimg.cc/TPbGvTHW/Copy-of-BUNYI-KATA-APPS.png" style="width: 50px; height: 50px; object-fit: contain;" alt="Icon"/>';
                
                const textEl = document.createElement('div');
                textEl.style.fontWeight = 'bold';
                textEl.style.fontSize = '1.2rem';
                textEl.style.color = 'var(--color-dark)';
                textEl.innerText = item.front;
                
                btn.appendChild(iconEl);
                btn.appendChild(textEl);
                grid.appendChild(btn);
            });
            
            const modal = document.getElementById('modal-senarai-sukukata');
            if(modal) modal.style.display = 'flex';
        };

        window.tutupModalSenaraiSukuKata = function() {
            const modal = document.getElementById('modal-senarai-sukukata');
            if(modal) modal.style.display = 'none';
        };

        window.mainAudioSukuKataSemasa = function() {
            const item = activeFlashcards[currentFlashcardIndex];
            if(item) {
                const card = document.getElementById('sukukata-k3d-card');
                const isFlipped = card && card.classList.contains('is-flipped');
                if(isFlipped) {
                    sebutAudio(moduleContentData[currentModuleId] && moduleContentData[currentModuleId].audioBack ? moduleContentData[currentModuleId].audioBack(item) : item.back);
                } else {
                    sebutAudio(moduleContentData[currentModuleId] && moduleContentData[currentModuleId].audioFront ? moduleContentData[currentModuleId].audioFront(item) : item.front);
                }
            }
        }

window.masukModMurid = function() {
    // default student
    window.namaMuridAktif = "Murid";
    window.selectedAvatarIcon = "https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png";
    
    // ensure studentData has this user
    if(typeof window.studentData !== 'undefined') {
        if(!window.studentData["Murid"]) {
            window.studentData["Murid"] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon };
        }
    }
    
    // UI Updates
    document.body.classList.remove('teacher-mode');
    
        var namaPapar = document.getElementById('nama-murid-papar');
    if(namaPapar) namaPapar.innerText = "Murid";
    
        var menuAvatar = document.getElementById('menu-avatar-icon');
    if(menuAvatar) menuAvatar.className = "fa-solid " + window.selectedAvatarIcon;
    
        var profilNamaBesar = document.getElementById('profil-nama-besar');
    if(profilNamaBesar) profilNamaBesar.innerText = "Murid";
    
        var profileAvatar = document.getElementById('profil-avatar-icon');
    if(profileAvatar) profileAvatar.className = "fa-solid " + window.selectedAvatarIcon;
    
    if(typeof window.paparSkrin === 'function') {
        const initialHash = window.location.hash.replace('#', '');
        if (initialHash && document.getElementById(initialHash)) {
            window.paparSkrin(initialHash, true);
        } else {
            window.paparSkrin('main-menu-screen');
        }
    }
    if(typeof window.sebutAudio === 'function') {
        window.sebutAudio("Selamat datang Murid");
    }
}
window.flipFlashcard = flipFlashcard;

window.tutupSidePanel = tutupSidePanel;

        // Every non-story item is one sentence, therefore one audio playback.
        const gradedReadingContent = {
            ayat_mudah: ['Ibu ada.', 'Bapa ada.', 'Ini bola.', 'Itu topi.', 'Kaki saya.', 'Mata saya.', 'Baju biru.', 'Kucing itu.', 'Nasi ini.', 'Buku saya.'],
            ayat_pendek: ['Saya suka makan nasi.', 'Ibu memasak di dapur.', 'Kucing itu sangat comel.', 'Adik saya suka bermain.', 'Bapa pergi ke pejabat.', 'Kakak membaca buku cerita.', 'Kami pergi ke sekolah.', 'Burung itu terbang tinggi.', 'Saya minum air kosong.', 'Kami makan bersama.'],
            ayat_panjang: ['Ibu memasak nasi lemak untuk sarapan pagi ini.', 'Kami pergi ke taman permainan pada hari Sabtu.', 'Bapa membeli buah-buahan segar di pasar tani.', 'Kucing kecil itu bermain dengan bola di halaman rumah.', 'Adik saya belajar membaca buku cerita setiap malam.', 'Guru mengajar kami menulis huruf abjad dengan rapi.', 'Kami menyanyi lagu sambil bertepuk tangan dengan gembira.', 'Burung kecil itu terbang tinggi di langit biru.', 'Kakak membantu ibu membasuh pinggan selepas makan malam.', 'Kami berkumpul di padang sekolah untuk beriadah pagi.'],
            petikan_tahap_1: [
                ['Kereta', 'Ini kereta bapa.', 'Kereta bapa biru.', 'Bapa bawa kereta laju.'],
                ['Bola', 'Ini bola saya.', 'Bola saya merah.', 'Saya baling bola jauh.'],
                ['Topi', 'Ini topi adik.', 'Topi adik kuning.', 'Adik pakai topi elok.'],
                ['Beg', 'Ini beg kakak.', 'Beg kakak hijau.', 'Kakak bawa beg berat.'],
                ['Basikal', 'Ini basikal abang.', 'Basikal abang hitam.', 'Abang kayuh basikal laju.']
            ],
            petikan_tahap_2: [
                ['Rumah', 'Ini rumah saya.', 'Rumah saya besar.', 'Saya tinggal di rumah besar.', 'Saya tinggal di rumah besar bersama keluarga.'],
                ['Sekolah', 'Ini sekolah kami.', 'Sekolah kami ceria.', 'Kami belajar di sekolah ceria.', 'Kami belajar di sekolah ceria setiap hari.'],
                ['Kucing', 'Ini kucing saya.', 'Kucing saya comel.', 'Saya bermain dengan kucing comel.', 'Saya bermain dengan kucing comel setiap petang.'],
                ['Taman', 'Ini taman kami.', 'Taman kami luas.', 'Kami berlari di taman luas.', 'Kami berlari di taman luas pada waktu pagi.'],
                ['Dapur', 'Ini dapur ibu.', 'Dapur ibu bersih.', 'Ibu memasak di dapur bersih.', 'Ibu memasak di dapur bersih setiap petang.']
            ],
            cerita_pendek: [
                { title: 'Kucing Comel', text: 'Comel ialah seekor kucing kecil. Comel tinggal bersama Ali di rumah. Setiap pagi, Comel bermain di halaman rumah. Comel suka makan ikan dan minum susu. Ali sangat sayang akan Comel.' },
                { title: 'Hari Sukan', text: 'Hari ini sekolah mengadakan hari sukan. Murid-murid memakai baju sukan berwarna-warni. Ani berlari pantas dalam pertandingan lari. Ani berjaya memenangi hadiah pertama. Semua murid bertepuk tangan dengan gembira.' },
                { title: 'Pergi ke Pasar', text: 'Pada hari Sabtu, ibu pergi ke pasar. Ali turut serta bersama ibu ke pasar. Mereka membeli sayur, buah dan ikan segar. Ali membantu ibu membawa beg barang. Mereka pulang ke rumah dengan gembira.' },
                { title: 'Pokok Mangga', text: 'Di halaman rumah Ali, ada sebatang pokok mangga. Setiap tahun, pokok itu berbuah lebat. Ali suka memetik buah mangga yang masak. Ibu memasak jeruk mangga yang sedap. Sekeluarga menikmati mangga bersama-sama.' },
                { title: 'Kelas Ceria', text: 'Cikgu Nur mengajar kelas prasekolah setiap hari. Murid-murid belajar membaca dan menyanyi bersama. Ali dan Ani suka bermain di sudut buku. Cikgu Nur sentiasa sabar mengajar murid-muridnya. Kelas itu sentiasa ceria dan gembira.' }
            ]
        };

        function createBacaanItems(id) {
            const content = gradedReadingContent[id];
            const bookIcon = 'fa-solid fa-book-open';
            if (!content) return null;
            if (id === 'cerita_pendek') {
                return content.map((story, index) => ({ title: `${index + 1}. ${story.title}`, text: story.text, icon: 'fa-solid fa-book' }));
            }
            if (id === 'petikan_tahap_1' || id === 'petikan_tahap_2') {
                return content.flatMap(passage => passage.slice(1).map((sentence, sentenceIndex) => ({ title: `${passage[0]} - Ayat ${sentenceIndex + 1}`, text: sentence, icon: bookIcon })));
            }
            return content.map((sentence, index) => ({ title: `Ayat ${index + 1}`, text: sentence, icon: bookIcon }));
        }

        var currentBacaanIndex = 0;
        var activeBacaanItems = [];

        function initBelajarBacaan(id, title) {
            currentModuleId = id;
            currentModuleTitle = title;
            currentBacaanIndex = 0;
            
            const data = moduleContentData[id];
            const gradedItems = createBacaanItems(id);
            
            const titleEl = document.getElementById('belajar-bacaan-title');
            if (titleEl) titleEl.innerText = title;

            const badgeEl = document.getElementById('bacaan-level-badge');
            if (badgeEl) badgeEl.innerText = title;

            if (gradedItems) {
                activeBacaanItems = gradedItems;
            } else if (data && (data.items || data.flashcards)) {
                activeBacaanItems = data.items || data.flashcards;
            } else {
                activeBacaanItems = [
                    { title: 'Bacaan 1', text: 'Ini ialah bacaan bergred.', icon: '📖' }
                ];
            }

            renderBelajarBacaan();
            paparSkrin('view-belajar-bacaan');
        }

        function renderBelajarBacaan() {
            const item = activeBacaanItems[currentBacaanIndex];
            if (!item) return;

            const counterEl = document.getElementById('bacaan-counter-pill');
            if (counterEl) {
                counterEl.innerText = `${currentBacaanIndex + 1} / ${activeBacaanItems.length}`;
            }

            const iconEl = document.getElementById('bacaan-item-icon');
            if (iconEl && item.icon && item.icon.startsWith('fa-')) {
                iconEl.className = item.icon;
                iconEl.textContent = '';
            }
            if (iconEl) iconEl.innerText = item.icon || '📖';

            if (iconEl && item.icon && item.icon.startsWith('fa-')) {
                iconEl.className = item.icon;
                iconEl.textContent = '';
            }

            const itemTitleEl = document.getElementById('bacaan-item-title');
            if (itemTitleEl) itemTitleEl.innerText = item.title || `Bacaan ${currentBacaanIndex + 1}`;

            const textDisplayEl = document.getElementById('bacaan-text-display');
            if (textDisplayEl) {
                const textContent = item.text || item.front || '';
                textDisplayEl.replaceChildren();
                textContent.split('\n').forEach(line => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = line;
                    textDisplayEl.appendChild(paragraph);
                });
            }
        }

        function mainAudioBacaanSemasa() {
            const item = activeBacaanItems[currentBacaanIndex];
            if (!item) return;
            const textToRead = item.text || item.front || '';
            sebutAudio(textToRead.replace(/\n/g, ' '));
        }

        function nextBelajarBacaan() {
            if (currentBacaanIndex < activeBacaanItems.length - 1) {
                currentBacaanIndex++;
                renderBelajarBacaan();
            }
        }

        function prevBelajarBacaan() {
            if (currentBacaanIndex > 0) {
                currentBacaanIndex--;
                renderBelajarBacaan();
            }
        }

        function bukaModalSenaraiBacaan() {
            const modal = document.getElementById('modal-senarai-bacaan');
            const grid = document.getElementById('senarai-bacaan-grid');
            const modalTitle = document.getElementById('senarai-bacaan-title');

            if (modalTitle) modalTitle.innerText = `Senarai ${currentModuleTitle || 'Bacaan'}`;

            if (grid) {
                grid.innerHTML = '';
                activeBacaanItems.forEach((item, idx) => {
                    const btn = document.createElement('button');
                    btn.className = `neo-btn ${idx === currentBacaanIndex ? 'bg-yellow' : 'bg-purple'}`;
                    btn.style.padding = '12px';
                    btn.style.display = 'flex';
                    btn.style.flexDirection = 'column';
                    btn.style.alignItems = 'center';
                    btn.style.gap = '6px';
                    btn.innerHTML = `
                        <span style="font-size: 1.8rem; line-height: 1;">${item.icon || '📖'}</span>
                        <span style="font-size: 0.95rem; font-weight: bold;">${item.title || `Bacaan ${idx + 1}`}</span>
                    `;
                    const icon = btn.firstElementChild;
                    if (icon && item.icon && item.icon.startsWith('fa-')) {
                        icon.className = item.icon;
                        icon.textContent = '';
                    }
                    btn.onclick = () => {
                        currentBacaanIndex = idx;
                        renderBelajarBacaan();
                        tutupModalSenaraiBacaan();
                    };
                    grid.appendChild(btn);
                });
            }

            if (modal) modal.style.display = 'flex';
        }

        function tutupModalSenaraiBacaan() {
            const modal = document.getElementById('modal-senarai-bacaan');
            if (modal) modal.style.display = 'none';
        }

        window.initBelajarBacaan = initBelajarBacaan;
        window.renderBelajarBacaan = renderBelajarBacaan;
        window.mainAudioBacaanSemasa = mainAudioBacaanSemasa;
        window.nextBelajarBacaan = nextBelajarBacaan;
        window.prevBelajarBacaan = prevBelajarBacaan;
        window.bukaModalSenaraiBacaan = bukaModalSenaraiBacaan;
        window.tutupModalSenaraiBacaan = tutupModalSenaraiBacaan;
window.bukaModalAksesGuru = bukaModalAksesGuru;
window.keluarModGuru = keluarModGuru;
window.tutupModalAksesGuru = tutupModalAksesGuru;
window.tutupModal = tutupModal;
window.bukaPeta = bukaPeta;
window.klikModul = klikModul;
window.bukaSidePanel = bukaSidePanel;
window.masukModGuru = masukModGuru;
window.toggleTheme = toggleTheme;
window.logMasukMurid = logMasukMurid;
window.bukaModalPilihPeta = bukaModalPilihPeta;
window.tuntutGanjaranHarian = tuntutGanjaranHarian;
window.kembaliKePilihPeta = kembaliKePilihPeta;
window.navigate = navigate;
window.flipCardAndSync = flipCardAndSync;
window.prevFlashcard = prevFlashcard;
window.nextFlashcard = nextFlashcard;
window.sebutAudioHighlight = sebutAudioHighlight;
window.paparBantuan = paparBantuan;
window.pilihPadanan = pilihPadanan;
window.semakPadanan = semakPadanan;
window.semakDragDrop = semakDragDrop;
window.salahBelon = salahBelon;
window.betulBelon = betulBelon;
window.clearSlot = clearSlot;
window.pilihSukuKata = pilihSukuKata;
window.sahkanEjaan = sahkanEjaan;
window.mainAudioKuiz = mainAudioKuiz;
window.semakKuizAudio = semakKuizAudio;
window.buangSusunKata = buangSusunKata;
window.pilihSusunKata = pilihSusunKata;
window.semakSusunKata = semakSusunKata;
window.muatTurunSijil = muatTurunSijil;
window.muatTurunCSV = muatTurunCSV;
window.cetakLaporanPDF = cetakLaporanPDF;
window.tutupBantuan = tutupBantuan;
window.bukaSenaraiHuruf = bukaSenaraiHuruf;
window.prevBelajarSukuKata = prevBelajarSukuKata;
window.nextBelajarSukuKata = nextBelajarSukuKata;
window.allowDrop = allowDrop;
window.dropSyllable = dropSyllable;
window.mulaTarikGarisan = mulaTarikGarisan;
window.tamatTarikGarisan = tamatTarikGarisan;
window.backToModeSelection = function() {
    const loginCard = document.getElementById('student-login-card');
    const modeButtons = document.getElementById('mode-buttons-container');
    if (loginCard) loginCard.style.display = 'none';
    if (modeButtons) modeButtons.style.display = 'flex';
}

window.resetLatihanSemasa = function(latihanKey, viewId) {
    if(confirm('Adakah anda pasti ingin menetapkan semula progres untuk latihan ini?')) {
        if(window.namaMuridAktif) {
            // clear auto save
            const dataAuto = JSON.parse(localStorage.getItem('bunyiKataAutoSave') || '{}');
            if(dataAuto[window.namaMuridAktif]) {
                delete dataAuto[window.namaMuridAktif][latihanKey];
                localStorage.setItem('bunyiKataAutoSave', JSON.stringify(dataAuto));
            }
            
            // clear student data
            if(window.studentData && window.studentData[window.namaMuridAktif]) {
                const sData = window.studentData[window.namaMuridAktif];
                if(sData.latihan) sData.latihan[latihanKey] = false;
                if(sData.scores) sData.scores[latihanKey] = 0;
                
                if(typeof window.saveStudentData === 'function') {
                    window.saveStudentData();
                }
            }
            
            // Re-initialize view
            if(typeof window.navigate === 'function') {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); setTimeout(() => window.navigate(viewId, null), 10);
            }
        }
    }
}

window.renderGuruSenaraiPerkataan = function(moduleId) {
    const listContainer = document.getElementById('guru-perkataan-list');
    if (!listContainer) return;
    
    // Fallback to KV if undefined
    if (!moduleId) moduleId = 'suku_kata_kv';
    const selectEl = document.getElementById('guru-modul-select');
    if (selectEl) selectEl.value = moduleId;

    if (!moduleContentData || !moduleContentData[moduleId] || !moduleContentData[moduleId].flashcards) {
        listContainer.innerHTML = '<p>Tiada data untuk modul ini.</p>';
        return;
    }

    const cards = moduleContentData[moduleId].flashcards;
    let html = '';
    cards.forEach(card => {
        let frontText = card.front;
        if(frontText.includes('-')) {
            frontText = frontText.split('-').map((p, i) => `<span style="color: ${i % 2 === 0 ? 'black' : 'red'};">${p.trim()}</span>`).join('');
        } else {
            frontText = `<span style="color: black;">${frontText}</span>`;
        }

        html += `
        <div class="neo-box" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 120px; padding: 10px; background-color: white;">
            <div style="font-size: 3rem; margin-bottom: 10px;">${card.icon || '❓'}</div>
            <div style="font-size: 1.5rem; font-weight: bold; text-align: center;">${frontText}</div>
            <div style="font-size: 1rem; color: #555; margin-top: 5px;">${card.back}</div>
        </div>
        `;
    });
    listContainer.innerHTML = html;
};


function requestSensorPermissionAndStart(type) {
    const existingModal = document.getElementById('sensor-permission-modal');
    if (existingModal) existingModal.remove();

    const modalHtml = `
        <div id="sensor-permission-modal" class="modal-overlay" style="z-index: 100000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.85); position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;">
            <div class="neo-box" style="text-align: center; max-width: 280px; width: 85%; padding: 20px 15px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); margin: 0 auto;">
                <h3 style="margin-bottom: 10px; font-size: 1.2rem; color: #1e293b; font-weight: bold;">Akses Peranti</h3>
                <p style="margin-bottom: 20px; color: #475569; font-size: 0.9rem; line-height: 1.4;">Benarkan akses pergerakan (motion & orientation) untuk mengawal VR/AR.</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="btn-allow-sensor" class="neo-btn bg-green" style="padding: 10px 15px; font-size: 0.95rem; flex: 1;">Benarkan</button>
                    <button id="btn-deny-sensor" class="neo-btn bg-red" style="padding: 10px 15px; font-size: 0.95rem; flex: 1;">Batal</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('btn-deny-sensor').onclick = () => {
        const m = document.getElementById('sensor-permission-modal');
        if(m) m.remove();
    };
    
    document.getElementById('btn-allow-sensor').onclick = () => {
        const m = document.getElementById('sensor-permission-modal');
        if(m) m.remove();
        
        const startScene = () => {
            console.log('Starting scene:', type);
            if (type === 'vr') startVRScene();
            else startARScene();
        };

        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        startScene();
                    } else {
                        alert('Akses penderia ditolak. Pengalaman VR/AR mungkin terhad.');
                        startScene(); // Fallback
                    }
                })
                .catch(e => {
                    console.error('DeviceOrientationEvent error:', e);
                    startScene();
                });
        } else {
            startScene();
        }
    };
}

window.bukaVRABC = function() {
    requestSensorPermissionAndStart('vr');
};

function startVRScene() {
    paparSkrin('view-vr-abc');
    
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['play-on-hover']) {
        AFRAME.registerComponent('play-on-hover', {
            schema: {type: 'string'},
            init: function () {
                this.el.addEventListener('mouseenter', () => {
                    if (window.sebutAudio) window.sebutAudio(this.data);
                });
            }
        });
    }

    const container = document.getElementById('vr-container');
    if (container.innerHTML.trim() !== '') return; // Already initialized
    
    let buttons = '';
    for(let i=0; i<26; i++) {
        const letter = String.fromCharCode(65 + i);
        const x = (i % 6) * 1.5 - 3.75;
        const y = -Math.floor(i / 6) * 1.5 + 4;
        const z = -6;
        buttons += `<a-box position="${x} ${y} ${z}" depth="0.2" height="1" width="1" color="#f59e0b"
            class="clickable"
            animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            play-on-hover="${letter.toLowerCase()}">
            <a-text value="${letter}" align="center" color="#000" position="0 0 0.11" scale="3 3 3"></a-text>
        </a-box>`;
    }
    
    container.innerHTML = `
        <a-scene embedded style="width: 100vw; height: 100dvh;" device-orientation-permission-ui="enabled: false">
            <a-assets>
                <img id="skyImage" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" crossorigin="anonymous">
            </a-assets>
            <a-sky src="#skyImage"></a-sky>
            
            <a-entity position="0 0 0">
                ${buttons}
            </a-entity>
            
            <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                <a-cursor raycaster="objects: .clickable" color="red"></a-cursor>
            </a-entity>
        </a-scene>
    `;
}

window.bukaARABC = function() {
    requestSensorPermissionAndStart('ar');
};

function startARScene() {
    paparSkrin('view-ar-abc');
    
    if (typeof AFRAME !== 'undefined' && !AFRAME.components['play-on-hover']) {
        AFRAME.registerComponent('play-on-hover', {
            schema: {type: 'string'},
            init: function () {
                this.el.addEventListener('mouseenter', () => {
                    if (window.sebutAudio) window.sebutAudio(this.data);
                });
            }
        });
    }

    const container = document.getElementById('ar-container');
    
    const startCam = () => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                const video = document.getElementById('ar-camera-bg');
                if (video) {
                    video.srcObject = stream;
                    video.style.transform = 'none'; // reset mirror for environment camera
                }
            })
            .catch(err => {
                console.error("Environment camera error, falling back to front:", err);
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        const video = document.getElementById('ar-camera-bg');
                        if (video) video.srcObject = stream;
                    }).catch(e => console.log('No camera found'));
            });
    };

    if (container.innerHTML.trim() !== '') {
        startCam();
        return; // Already initialized
    }
    
    let buttons = '';
    for(let i=0; i<26; i++) {
        const letter = String.fromCharCode(65 + i);
        const x = (i % 6) * 1 - 2.5;
        const y = -Math.floor(i / 6) * 1 + 3;
        const z = -4;
        buttons += `<a-box position="${x} ${y} ${z}" depth="0.1" height="0.8" width="0.8" color="#3b82f6"
            class="clickable"
            animation__mouseenter="property: scale; to: 1.2 1.2 1.2; startEvents: mouseenter; dur: 200"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            play-on-hover="${letter.toLowerCase()}">
            <a-text value="${letter}" align="center" color="#fff" position="0 0 0.06" scale="2 2 2"></a-text>
        </a-box>`;
    }
    
    container.innerHTML = `
        <video id="ar-camera-bg" autoplay playsinline style="position: absolute; top: 0; left: 0; width: 100vw; height: 100dvh; object-fit: cover; z-index: -1; transform: scaleX(-1);"></video>
        <a-scene embedded style="width: 100vw; height: 100dvh;" renderer="alpha: true" device-orientation-permission-ui="enabled: false">
            <a-entity position="0 0 0">
                ${buttons}
            </a-entity>
            
            <a-entity camera look-controls="touchEnabled: false; magicWindowTrackingEnabled: true;">
                <a-cursor raycaster="objects: .clickable" color="yellow"></a-cursor>
            </a-entity>
        </a-scene>
    `;
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            const video = document.getElementById('ar-camera-bg');
            if (video) {
                video.srcObject = stream;
                video.style.transform = 'none'; // reset mirror for environment camera
            }
        })
        .catch(err => {
            console.error("Environment camera error, falling back to front:", err);
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    const video = document.getElementById('ar-camera-bg');
                    if (video) video.srcObject = stream;
                }).catch(e => console.log('No camera found'));
        });
}

window.bukaTandukKata = function() {
    if (window.currentPeta === 3) {
        const m = document.getElementById('modal-pilih-suku-kata-hero');
        if (m) m.style.display = 'flex';
    } else {
        const m = document.getElementById('modal-pilih-tanduk-kata');
        if (m) m.style.display = 'flex';
    }
};

window.bukaSukuKataHero = function() {
    const m = document.getElementById('modal-pilih-suku-kata-hero');
    if (m) m.style.display = 'flex';
};

window.bukaPerpustakaan = function() {
    window.paparSkrin('view-perpustakaan');
};



window.playBubble = playBubble;
window.playOops = playOops;
window.playTada = playTada;
window.sebutAudio = sebutAudio;
