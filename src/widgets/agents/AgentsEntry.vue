<template>
  <div class="list-group-item border-start-0 border-end-0 border-top-0 px-lg-0 py-3">
    <div class="d-flex w-100 justify-content-between align-items-start agents-entry">
      <div class="agent-main d-flex text-truncate">
        <div v-if="settings.showAgentImage && agent.icon" class="agent-avatar me-3 flex-shrink-0">
          <img
            :src="`/agents/${agent.icon}.jpg`"
            :alt="agent.name"
            class="agent-avatar-img"
          />
        </div>

        <div class="flex-grow-1">
          <div class="d-flex align-items-baseline flex-wrap">
            <h5 class="mb-0 me-2 text-truncate title" :title="agent.name">
              {{ agent.name }}
            </h5>
            <small v-if="agent.originFactionNameShort" class="text-muted text-truncate me-2">
              <span class="agent-name-separator">•</span>{{ agent.originFactionNameShort }}
            </small>
          </div>
          <div v-if="agent.shipName" class="text-sm text-muted text-truncate">
            <span class="me-1">{{ agent.shipName }}</span>
            <span v-if="agent.shipPrestige !== null && agent.shipPrestige !== undefined">
              <span class="agent-name-separator">•</span>{{ $t('app.widgets.agents.prestige') }}: {{ agent.shipPrestige }}
            </span>
          </div>
          <div v-if="agent.rank" class="agent-rank text-xs text-muted">
            Rank: {{ agent.rank }}
          </div>

          <div
            v-if="settings.showAgentDetails && (agent.negotiationLevel || agent.espionageLevel)"
            class="agent-skills text-xs text-muted"
          >
            <div v-if="agent.negotiationLevel">
              Negotiation: {{ agent.negotiationLevel }}
            </div>
            <div v-if="agent.espionageLevel">
              Espionage: {{ agent.espionageLevel }}
            </div>
          </div>
        </div>
      </div>
      <div class="agent-mission text-sm text-end ms-3">
        <template v-if="agent.currentMission">
          <div class="d-flex justify-content-end align-items-center">
            <span
              class="mission-name title text-white text-wrap text-end"
              :title="agent.currentMission.name"
            >
              <font-awesome-icon :icon="'star'" class="fa-icon me-1" />
              {{ agent.currentMission.name }}
            </span>
          </div>
          <div
            v-if="agent.currentMission.target"
            class="mission-target text-sm text-muted text-truncate"
          >
            {{ agent.currentMission.target }}
          </div>

          <div class="mission-meta text-xs">
            <div
              v-if="settings.showMissionDetails && agent.currentMission.successChance !== null && agent.currentMission.successChance !== undefined"
            >
              {{ $t('app.widgets.agents.success_chance') }}:
              {{ agent.currentMission.successChance }}%
              <span v-if="agent.currentMission.likelihoodOfSuccess">
                ({{ agent.currentMission.likelihoodOfSuccess }})
              </span>
            </div>
          </div>
          <div v-if="settings.showMissionDetails && agent.currentMission.rewards" class="mission-rewards text-xs">
            {{ $t('app.widgets.agents.rewards') }}: {{ agent.currentMission.rewards }}
          </div>
          <div
            v-if="agent.currentMission.timeLeftText"
            class="mission-time text-xs text-muted"
          >
            <font-awesome-icon :icon="'clock'" class="fa-icon me-1" />
            {{ missionTimeLeftText }}
          </div>
        </template>
        <template v-else>
          <div class="mission-status">
            <span class="mission-name badge bg-dark text-white text-wrap text-start">
              No mission assigned
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import passedTimeMixin from "../../mixins/passedTimeMixin";

export default {
  name: 'AgentsEntry',
  mixins: [passedTimeMixin],
  props: {
    agent: {
      type: Object,
      required: true,
    },
    settings: {
      type: Object,
      default: () => ({
        showAgentImage: true,
        showAgentDetails: true,
        showMissionDetails: true,
      }),
    },
  },
  computed: {
    missionTimeLeftText() {
      if (!this.agent || !this.agent.currentMission) {
        return null;
      }

      const currentMission = this.agent.currentMission;

      // Prefer endTime if it is available so we can count down based on global game time
      if (typeof currentMission.endTime === 'number') {
        const totalSeconds = Math.max(0, Math.round(currentMission.endTime - this.gameTime));

        if (totalSeconds <= 0) {
          // Mission is finished according to game time; keep original text if any
          return currentMission.timeLeftText || null;
        }

        return this.formatMissionTimeFromSeconds(totalSeconds);
      }

      // Fallback: if only timeLeftSeconds are available, use them as-is
      if (typeof currentMission.timeLeftSeconds === 'number') {
        const totalSeconds = Math.max(0, Math.round(currentMission.timeLeftSeconds));

        if (totalSeconds <= 0) {
          return currentMission.timeLeftText || null;
        }

        return this.formatMissionTimeFromSeconds(totalSeconds);
      }

      // Last fallback: show whatever text backend provided
      return currentMission.timeLeftText || null;
    },
  },
  methods: {
    formatMissionTimeFromSeconds(totalSeconds) {
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      const parts = [];

      if (days > 0) {
        parts.push(`${days}d`);
      }

      if (hours > 0) {
        parts.push(`${hours}h`);
      }

      if (minutes > 0) {
        parts.push(`${minutes}m`);
      }

      parts.push(`${seconds}s`);

      return parts.join(' ');
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";

.agents-entry {
  .agent-main {
    min-width: 0;
  }

  .agent-rank {
    margin-top: 10px;
  }

  .skill-badge {
    font-weight: 400;
    font-size: 0.7rem;
    white-space: nowrap;
  }

  .agent-name-separator {
    position: relative;
    top: -1px;
    margin: 0 0.4rem 0 0;
  }

  .agent-main .text-sm,
  .agent-main .text-xs,
  .agent-mission .text-sm,
  .agent-mission .text-xs {
    line-height: 1.4;
  }

  .agent-mission {
    min-width: 180px;

    .mission-name {
      font-weight: 600;
    }

    .mission-meta {
      margin-top: 10px;
    }

    .mission-time {
      white-space: nowrap;
    }
  }
}
</style>

