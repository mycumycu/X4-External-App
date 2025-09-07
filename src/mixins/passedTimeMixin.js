/**
 * Mixin for components that need to display and update passed time
 * Calculates elapsed time using store's game time and entry time
 */
import GlobalStore from '../globalStore'

export default {
    data () {
        return {
            currentPassedTime: 0,
            intervalId: null,
        }
    },

    computed: {
        /**
         * @return {string}
         */
        formattedPassedTime () {
            if (this.gameTime && this.entry?.time) {
                const totalSeconds = this.gameTime - this.entry.time;
                return this.formatTimeFromSeconds(totalSeconds);
            }
            return this.formatTimeFromSeconds(this.currentPassedTime);
        },

        /**
         * Get game time from the store
         * @return {number|null}
         */
        gameTime () {
            return GlobalStore.state.gameTime;
        }
    },

    watch: {
        gameTime: {
            handler () {
                this.updateElapsedTime();
            },
            immediate: true
        },
        'entry.time': {
            handler () {
                this.updateElapsedTime();
            },
            immediate: true
        }
    },

    mounted () {
        this.startTimer();
    },

    beforeUnmount () {
        this.stopTimer();
    },

    methods: {
        /**
         * Update elapsed time calculation
         */
        updateElapsedTime () {
            if (this.gameTime && this.entry?.time) {
                // Calculate elapsed time: current game time - entry creation time
                this.currentPassedTime = this.gameTime - this.entry.time;
                this.startTimer();
            }
        },

        /**
         * Format time from seconds value
         * @param {number} totalSeconds
         * @return {string}
         */
        formatTimeFromSeconds (totalSeconds) {
            // Check for invalid values
            if (isNaN(totalSeconds) || totalSeconds === null || totalSeconds === undefined) {
                return 'Invalid time';
            }

            const dayShort = this.$t('app.common.time.day_short');
            const hourShort = this.$t('app.common.time.hour_short');
            const minuteShort = this.$t('app.common.time.minute_short');
            const ago = this.$t('app.common.time.ago');

            if (totalSeconds < 3600) {
                // Less than 1 hour: show minutes only
                const minutes = Math.floor(totalSeconds / 60);
                return `${minutes}${minuteShort} ${ago}`;
            } else if (totalSeconds < 3600 * 24) {
                // Less than 24 hours: show hours and minutes
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                return `${hours}${hourShort} ${minutes}${minuteShort} ${ago}`;
            } else {
                // 24 hours or more: show days, hours and minutes
                const days = Math.floor(totalSeconds / (3600 * 24));
                const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                return `${days}${dayShort} ${hours}${hourShort} ${minutes}${minuteShort} ${ago}`;
            }
        },

        /**
         * Start the timer that updates every second
         * Since data updates every 1s, we just need to trigger reactivity
         */
        startTimer () {
            this.stopTimer(); // Clear any existing timer
            this.intervalId = setInterval(() => {
                // Force reactivity update - computed property will recalculate from fresh store data
                this.$forceUpdate();
            }, 1000);
        },

        /**
         * Stop the timer
         */
        stopTimer () {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        }
    }
}
