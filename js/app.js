/* =========================================
   BEFORE - Core Application Logic
   ========================================= */

   const app = {
    currentView: 'view-home',

    init() {
        // Setup back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.navigateTo('view-home');
        });
    },

    navigateTo(viewId) {
        // Hide current
        document.getElementById(this.currentView).classList.remove('active');
        
        // Show new
        this.currentView = viewId;
        document.getElementById(viewId).classList.add('active');

        // Header visibility
        const header = document.getElementById('main-header');
        if (viewId === 'view-home') {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        // Reset states when leaving games
        if (viewId === 'view-home') {
            refGame.reset();
            aovGame.reset();
            blackjackGame.resetDeck();
        }
    }
};

/* =========================================
   GAME 1 : QUI A LA RÉF ?
   ========================================= */
const refGame = {
    words: [
        { ref: "Tacos", scamer: "Kebab" },
        { ref: "TikTok", scamer: "Reels" },
        { ref: "Elon Musk", scamer: "Mark Zuckerberg" },
        { ref: "Uber", scamer: "Bolt" }
    ],
    players: 4, // hardcoded for demo
    currentPlayer: 0,
    roles: [],
    
    reset() {
        document.getElementById('ref-setup').classList.remove('hidden');
        document.getElementById('ref-role').classList.add('hidden');
        document.getElementById('ref-vote').classList.add('hidden');
        this.currentPlayer = 0;
        this.roles = [];
    },

    startRound() {
        // Generate roles
        const wordPair = this.words[Math.floor(Math.random() * this.words.length)];
        this.roles = [
            { type: "LA RÉF", word: wordPair.ref, color: "var(--neon-cyan)" },
            { type: "LA RÉF", word: wordPair.ref, color: "var(--neon-cyan)" },
            { type: "SCAMER", word: wordPair.scamer, color: "var(--neon-violet)" },
            { type: "PNJ", word: "???", color: "var(--neon-red)" }
        ];
        // Shuffle roles
        this.roles.sort(() => Math.random() - 0.5);

        this.currentPlayer = 0;
        document.getElementById('ref-setup').classList.add('hidden');
        document.getElementById('ref-role').classList.remove('hidden');
        this.setupRoleCard();
    },

    setupRoleCard() {
        const role = this.roles[this.currentPlayer];
        document.getElementById('role-title').innerText = role.type;
        document.getElementById('role-title').style.color = role.color;
        document.getElementById('role-word').innerText = `Mot : ${role.word}`;
        
        // Hide content initially
        document.getElementById('role-secret').classList.add('hidden');
        document.querySelector('.instruction').classList.remove('hidden');
        document.getElementById('role-card-press').classList.remove('revealed');
    },

    nextPlayer() {
        this.currentPlayer++;
        if (this.currentPlayer < this.players) {
            this.setupRoleCard();
        } else {
            this.startVote();
        }
    },

    startVote() {
        document.getElementById('ref-role').classList.add('hidden');
        document.getElementById('ref-vote').classList.remove('hidden');
        document.getElementById('pnj-alert-btn').classList.add('hidden');
        
        let count = 3;
        const countdownEl = document.getElementById('ref-countdown');
        countdownEl.innerText = count;

        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.innerText = count;
            } else {
                clearInterval(interval);
                countdownEl.innerText = "VOTEZ !";
                document.getElementById('pnj-alert-btn').classList.remove('hidden');
            }
        }, 1000);
    },

    triggerPnjLastChance() {
        alert("ALERTE : Le PNJ a une dernière chance de voler la victoire ! Tape le mot secret :");
        app.navigateTo('view-home'); // Reset demo
    }
};

// Press & Hold logic for REF
const roleCard = document.getElementById('role-card-press');
const showRole = () => {
    document.querySelector('#role-card-press .instruction').classList.add('hidden');
    document.getElementById('role-secret').classList.remove('hidden');
    roleCard.classList.add('revealed');
};
const hideRole = () => {
    document.querySelector('#role-card-press .instruction').classList.remove('hidden');
    document.getElementById('role-secret').classList.add('hidden');
    roleCard.classList.remove('revealed');
};

roleCard.addEventListener('mousedown', showRole);
roleCard.addEventListener('mouseup', hideRole);
roleCard.addEventListener('mouseleave', hideRole);
roleCard.addEventListener('touchstart', (e) => { e.preventDefault(); showRole(); });
roleCard.addEventListener('touchend', hideRole);


/* =========================================
   GAME 2 : ACTION OU VÉRITÉ
   ========================================= */
const aovGame = {
    prompts: {
        'soft': [
            "Quelle est ta pire photo de profil Facebook ?",
            "Mime ton emoji le plus utilisé.",
            "Laisse le groupe choisir ta prochaine story Instagram."
        ],
        'sans-filtre': [
            "Qui ici a les pires goûts musicaux ?",
            "Montre le dernier message que tu as envoyé à ton ex.",
            "Laisse la personne à ta droite lire ton dernier DM."
        ],
        'piratage': [
            "Montre ton temps d'écran à tout le monde.",
            "Envoie 'Je crois que je t'aime' à la 5ème personne de tes contacts.",
            "Montre la 5ème photo de ta pellicule en cherchant 'Snapchat'."
        ]
    },

    reset() {
        document.getElementById('aov-setup').classList.remove('hidden');
        document.getElementById('aov-play').classList.add('hidden');
    },

    play(intensity) {
        document.getElementById('aov-setup').classList.add('hidden');
        document.getElementById('aov-play').classList.remove('hidden');

        const list = this.prompts[intensity];
        const prompt = list[Math.floor(Math.random() * list.length)];

        document.getElementById('aov-question').innerText = prompt;
        const badge = document.getElementById('aov-badge');
        badge.innerText = intensity.toUpperCase().replace('-', ' ');
        badge.className = `badge ${intensity}`; // soft, sans-filtre, piratage
    }
};

/* =========================================
   GAME 3 : BLACK(OUT)JACK
   ========================================= */
const blackjackGame = {
    cards: [
        { family: "CIBLE", rule: "Ceux qui ont moins de 20% de batterie boivent.", punishment: "1 Gorgée", color: "var(--neon-cyan)" },
        { family: "DUEL", rule: "Bataille de regards avec le joueur en face.", punishment: "Le perdant boit 2 gorgées", color: "var(--text-main)" },
        { family: "VIRUS", rule: "Interdit de prononcer un prénom.", punishment: "1 Gorgée à chaque erreur", color: "var(--neon-violet)" },
        { family: "RÉFLEXE", rule: "Le dernier qui lève les mains boit.", punishment: "Cul sec", color: "var(--neon-cyan)" },
        { family: "BOSS", rule: "Roulette Russe : Distribue 5 gorgées.", punishment: "Choisis tes victimes", color: "var(--neon-red)" }
    ],

    resetDeck() {
        document.getElementById('bj-deck').parentElement.classList.remove('hidden');
        document.getElementById('bj-result').classList.add('hidden');
    },

    drawCard() {
        const card = this.cards[Math.floor(Math.random() * this.cards.length)];
        
        document.getElementById('bj-family').innerText = card.family;
        document.getElementById('bj-family').style.color = card.color;
        document.getElementById('bj-rule').innerText = card.rule;
        document.querySelector('.punishment').innerText = `Punition : ${card.punishment}`;
        
        document.getElementById('bj-active-card').style.borderColor = card.color;
        document.getElementById('bj-active-card').style.boxShadow = `0 0 20px ${card.color}40`; // Add transparency to glow

        document.getElementById('bj-deck').parentElement.classList.add('hidden');
        document.getElementById('bj-result').classList.remove('hidden');
    }
};

// Initialize App
app.init();
