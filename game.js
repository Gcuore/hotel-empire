class Hotel {
  constructor() {
    this.money = 1000;
    this.rooms = [];
    this.guests = [];
    this.capacity = 5;
    this.staffLevel = 1;
    this.rating = 3;
    this.hotelEl = document.getElementById('hotel');
    this.level = 1;
    this.experience = 0;
    this.experienceToNext = 1000;
    this.marketingLevel = 1;
    this.cleaningLevel = 1;
    this.amenities = {
      pool: false,
      restaurant: false,
      gym: false
    };
    this.events = [];
    this.unlockedFeatures = {
      marketing: false,
      cleaning: false,
      amenities: false
    };
    
    this.setupUI();
    this.startGameLoop();
    this.updateUnlocks();
  }

  setupUI() {
    document.getElementById('build-room').addEventListener('click', () => this.buildRoom());
    document.getElementById('upgrade').addEventListener('click', () => this.upgrade());
    document.getElementById('hire-staff').addEventListener('click', () => this.hireStaff());
    document.getElementById('marketing').addEventListener('click', () => this.upgradeMarketing());
    document.getElementById('cleaning').addEventListener('click', () => this.upgradeCleaning());
    document.getElementById('add-pool').addEventListener('click', () => this.addAmenity('pool'));
    document.getElementById('add-restaurant').addEventListener('click', () => this.addAmenity('restaurant'));
    document.getElementById('add-gym').addEventListener('click', () => this.addAmenity('gym'));
    this.updateUI();
  }

  gainExperience(amount) {
    this.experience += amount;
    if (this.experience >= this.experienceToNext) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience -= this.experienceToNext;
    this.experienceToNext *= 1.5;
    this.capacity += 2;
    this.money += 1000;
    
    // Show level up animation
    const levelUpEl = document.createElement('div');
    levelUpEl.className = 'level-up';
    levelUpEl.textContent = 'Level Up!';
    if (this.level === 4) {
      levelUpEl.textContent = 'Level 4 Reached! New Features Unlocked!';
    }
    document.body.appendChild(levelUpEl);
    setTimeout(() => levelUpEl.remove(), 2000);
    
    this.updateUnlocks();
  }

  buildRoom() {
    if (this.money < 200) return;
    
    this.money -= 200;
    const room = {
      el: document.createElement('div'),
      occupied: false,
      x: Math.random() * (this.hotelEl.clientWidth - 80),
      y: Math.random() * (this.hotelEl.clientHeight - 60),
      quality: 1
    };
    
    room.el.className = 'room';
    room.el.style.left = room.x + 'px';
    room.el.style.top = room.y + 'px';
    
    this.hotelEl.appendChild(room.el);
    this.rooms.push(room);
    this.capacity += 1;
    
    this.updateUI();
    this.gainExperience(100);
  }

  upgrade() {
    if (this.money < 500) return;
    this.money -= 500;
    this.rating = Math.min(5, this.rating + 0.5);
    this.updateUI();
    this.gainExperience(250);
  }

  hireStaff() {
    if (this.money < 300) return;
    this.money -= 300;
    this.staffLevel++;
    this.updateUI();
    this.gainExperience(150);
  }

  addGuest(isVIP = false) {
    if (this.guests.length >= this.capacity) return;
    
    const emptyRooms = this.rooms.filter(r => !r.occupied);
    if (emptyRooms.length === 0) return;
    
    const room = emptyRooms[Math.floor(Math.random() * emptyRooms.length)];
    room.occupied = true;
    room.el.classList.add('occupied');
    if (isVIP) room.el.classList.add('vip');
    
    const guest = {
      el: document.createElement('div'),
      room: room,
      isVIP: isVIP,
      happiness: 100,
      stayDuration: 10 + Math.random() * 20
    };
    
    guest.el.className = 'guest' + (isVIP ? ' vip' : '');
    guest.el.style.left = (room.x + 30) + 'px';
    guest.el.style.top = (room.y + 20) + 'px';
    
    this.hotelEl.appendChild(guest.el);
    this.guests.push(guest);
    
    this.updateUI();
  }

  removeGuest(guest) {
    const tip = guest.happiness > 80 ? (guest.isVIP ? 100 : 50) : 0;
    this.money += tip;
    if (tip > 0) this.gainExperience(tip);
    
    guest.room.occupied = false;
    guest.room.el.classList.remove('occupied', 'vip');
    guest.el.remove();
    this.guests = this.guests.filter(g => g !== guest);
    this.updateUI();
  }

  upgradeMarketing() {
    if (!this.unlockedFeatures.marketing) return;
    const cost = this.marketingLevel * 400;
    if (this.money < cost) return;
    
    this.money -= cost;
    this.marketingLevel++;
    this.gainExperience(200);
    this.updateUI();
  }

  upgradeCleaning() {
    if (!this.unlockedFeatures.cleaning) return;
    const cost = this.cleaningLevel * 300;
    if (this.money < cost) return;
    
    this.money -= cost;
    this.cleaningLevel++;
    this.gainExperience(150);
    this.updateUI();
  }

  addAmenity(type) {
    if (!this.unlockedFeatures.amenities) return;
    const costs = {
      pool: 2000,
      restaurant: 3000,
      gym: 1500
    };

    if (this.money < costs[type] || this.amenities[type]) return;
    
    this.money -= costs[type];
    this.amenities[type] = true;
    this.rating += 0.5;
    this.capacity += 3;
    this.gainExperience(500);
    
    const amenityEl = document.createElement('div');
    amenityEl.className = `amenity ${type}`;
    this.hotelEl.appendChild(amenityEl);
    
    this.updateUI();
  }

  triggerSpecialEvent() {
    const events = [
      { name: 'Convention', duration: 20, bonus: 2 },
      { name: 'Wedding', duration: 10, bonus: 3 },
      { name: 'Celebrity Visit', duration: 5, bonus: 5 }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    event.timeLeft = event.duration;
    this.events.push(event);
    
    const eventEl = document.createElement('div');
    eventEl.className = 'event-notification';
    eventEl.textContent = `${event.name} is happening!`;
    document.body.appendChild(eventEl);
    setTimeout(() => eventEl.remove(), 3000);
  }

  updateUI() {
    document.getElementById('money').textContent = Math.floor(this.money);
    document.getElementById('guests').textContent = this.guests.length;
    document.getElementById('capacity').textContent = this.capacity;
    document.getElementById('rating').textContent = '⭐'.repeat(Math.floor(this.rating));
    document.getElementById('level').textContent = this.level;
    document.getElementById('experience').style.width = (this.experience / this.experienceToNext * 100) + '%';
    
    document.getElementById('marketing-level').textContent = this.marketingLevel;
    document.getElementById('cleaning-level').textContent = this.cleaningLevel;
    
    document.getElementById('build-room').disabled = this.money < 200;
    document.getElementById('upgrade').disabled = this.money < 500;
    document.getElementById('hire-staff').disabled = this.money < 300;
    document.getElementById('marketing').disabled = this.money < (this.marketingLevel * 400);
    document.getElementById('cleaning').disabled = this.money < (this.cleaningLevel * 300);
    document.getElementById('add-pool').disabled = this.money < 2000 || this.amenities.pool;
    document.getElementById('add-restaurant').disabled = this.money < 3000 || this.amenities.restaurant;
    document.getElementById('add-gym').disabled = this.money < 1500 || this.amenities.gym;
    
    const amenitiesText = Object.entries(this.amenities)
      .filter(([, has]) => has)
      .map(([type]) => `${type.charAt(0).toUpperCase() + type.slice(1)}`)
      .join(', ');
    document.getElementById('amenities').textContent = amenitiesText || 'None';
  }

  updateUnlocks() {
    // Unlock features based on level
    this.unlockedFeatures.marketing = this.level >= 4;
    this.unlockedFeatures.cleaning = this.level >= 4;
    this.unlockedFeatures.amenities = this.level >= 4;
    
    // Hide/show UI elements based on unlocks
    document.getElementById('advanced-controls').style.display = 
      this.unlockedFeatures.marketing || this.unlockedFeatures.cleaning ? 'grid' : 'none';
    document.getElementById('amenities-controls').style.display = 
      this.unlockedFeatures.amenities ? 'grid' : 'none';

    // Show locked message if trying to access locked features
    if (this.level < 4) {
      const lockedMsg = `Unlock more features at level 4 (Current: ${this.level})`;
      document.getElementById('locked-features').textContent = lockedMsg;
      document.getElementById('locked-features').style.display = 'block';
    } else {
      document.getElementById('locked-features').style.display = 'none';
    }
  }

  startGameLoop() {
    setInterval(() => {
      // Earn money from guests
      this.guests.forEach(guest => {
        const baseIncome = guest.isVIP ? 15 : 10;
        const staffBonus = this.staffLevel / 2;
        const ratingBonus = this.rating / 3;
        
        const income = baseIncome * staffBonus * ratingBonus;
        this.money += income;
        
        // Update guest happiness
        guest.happiness = Math.max(0, guest.happiness - (10 / this.staffLevel));
        guest.el.style.opacity = guest.happiness / 100;
        
        guest.stayDuration--;
        if (guest.stayDuration <= 0) {
          this.removeGuest(guest);
        }
      });
      
      // Random events
      if (Math.random() < 0.1) {
        if (Math.random() < this.rating / 10) {
          this.addGuest(true); // VIP guest
        } else {
          this.addGuest();
        }
      }
      
      // Special events handling
      this.events = this.events.filter(event => {
        event.timeLeft--;
        if (event.timeLeft <= 0) return false;
        this.money += 50 * event.bonus;
        return true;
      });

      // Random special event trigger
      if (Math.random() < 0.02 * this.marketingLevel / 10) {
        this.triggerSpecialEvent();
      }

      // Marketing effects
      if (Math.random() < this.marketingLevel / 20) {
        this.addGuest(Math.random() < 0.3);
      }

      // Cleaning effects on happiness
      this.guests.forEach(guest => {
        guest.happiness += this.cleaningLevel;
        guest.happiness = Math.min(100, guest.happiness);
      });
      
      this.updateUI();
    }, 1000);
  }
}

// Start menu handling
document.getElementById('start-game').addEventListener('click', () => {
  document.getElementById('start-menu').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  new Hotel();
});
