const PubSub = {
  events: {},
  subscribe(en, fn) {
    this.events[en] = this.events[en] || [];
    this.events[en].push(fn);
  },
  unsubscribe(en, fn) {
    if (this.events[en]) {
      for (let i = 0; i < this.events[en].length; i += 1) {
        if (this.events[en][i] === fn) {
          this.events[en].splice(i, 1);
          break;
        }
      }
    }
  },
  publish(en, data) {
    if (this.events[en]) {
      this.events[en].forEach((fn) => fn(data));
    }
  },
};

export default PubSub;
