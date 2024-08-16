class KeyBindingManager {
    constructor() {
        this.keyActionMap = {};
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
    }

    bindKey(key, callback) {
        if (!this.keyActionMap[key]) {
            this.keyActionMap[key] = callback;
        } else {
            console.warn(`Key '${key}' is already bound to an action.`);
        }
    }

    handleKeyEvent(event) {
        const action = this.keyActionMap[event.key];
        if (action) {
            action();
        }
    }

    click(key) {
        const action = this.keyActionMap[key];
        if (action) {
            action();
        }
    }

    setupListener() {
        document.addEventListener('keydown', this.handleKeyEvent);
    }

    removeListener() {
        document.removeEventListener('keydown', this.handleKeyEvent);
    }
}

export const CMD_MANAGER = new KeyBindingManager();