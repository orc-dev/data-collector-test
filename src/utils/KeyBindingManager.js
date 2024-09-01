class KeyBindingManager {
    constructor() {
        this.keyActionMap = {};
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.lastClickTime = -1000;
    }

    bindKey(key, callback) {
        if (!this.keyActionMap[key]) {
            // Add a timer to avoid quick double clicks
            this.keyActionMap[key] = () => {
                const currTime = performance.now();
                if (currTime - this.lastClickTime > 1000) {
                    this.lastClickTime = currTime;
                    callback();
                }
            };
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