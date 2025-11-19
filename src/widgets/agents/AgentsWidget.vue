<template>
  <widget>
    <template #header>
      <div class="d-flex justify-content-between">
        <h4 class="card-title pb-0 mb-0">{{ $t('app.widgets.agents.title') }}</h4>
        <div>
          <font-awesome-icon
            class="cursor-pointer"
            :icon="`cogs`"
            data-bs-toggle="modal"
            data-bs-target="#agents-settings"
          />
          <Modal
            id="agents-settings"
            :title="$t('app.widgets.agents.settings.title')"
            size="modal-lg"
          >
            <AgentsSettings :settings="settings" />
          </Modal>
        </div>
      </div>
    </template>

    <perfect-scrollbar class="agents-widget resizable-element" data-min-resizable-height="90">
      <div v-if="agents.length" class="list-group list-group-flush">
        <agents-entry
          v-for="agent in agents"
          :key="agent.id || agent.name"
          :agent="agent"
          :settings="settings"
        />
      </div>
      <div v-else class="text-muted small py-2">
        {{ $t('app.widgets.agents.no_agents') }}
      </div>
    </perfect-scrollbar>
  </widget>
</template>

<script>
import Widget from "../Widget.vue";
import AgentsEntry from "./AgentsEntry.vue";
import Modal from "../../components/Modal.vue";
import AgentsSettings from "./AgentsSettings.vue";
import { reactive } from "vue";

export default {
  name: 'AgentsWidget',
  components: { Widget, AgentsEntry, Modal, AgentsSettings },
  props: {
    gameData: [Array, Object, String],
    maxHeight: {
      type: Number,
      default: 40,
    },
  },
  data() {
    return {
      agents: [],
      settings: reactive(
        JSON.parse(localStorage.getItem("agentsSettings")) || {
          showAgentImage: true,
          showAgentDetails: true,
          showMissionDetails: true,
        }
      ),
    };
  },
  watch: {
    gameData: {
      handler(newData) {
        console.log('newData', newData);
        this.parseAgentsData(newData);
      },
      immediate: true,
    },
  },
  methods: {
    parseAgentsData(gameData) {
      let parsedAgents = [];

      if (!gameData) {
        this.agents = parsedAgents;
        return;
      }

      if (Array.isArray(gameData)) {
        parsedAgents = gameData;
      } else if (typeof gameData === 'object') {
        parsedAgents = Object.values(gameData);
      }

      parsedAgents = parsedAgents
        .map((agentEntry) => this.normalizeAgentEntry(agentEntry))
        .filter((agent) => {
          return agent && (agent.id !== undefined && agent.id !== null || agent.name);
        });

      parsedAgents.sort((firstAgent, secondAgent) => {
        const firstFaction = (firstAgent.originFactionName || '').toLowerCase();
        const secondFaction = (secondAgent.originFactionName || '').toLowerCase();

        if (firstFaction < secondFaction) {
          return -1;
        }
        if (firstFaction > secondFaction) {
          return 1;
        }

        const firstName = (firstAgent.name || '').toLowerCase();
        const secondName = (secondAgent.name || '').toLowerCase();

        if (firstName < secondName) {
          return -1;
        }
        if (firstName > secondName) {
          return 1;
        }
        return 0;
      });

      this.agents = parsedAgents;
    },

    normalizeAgentEntry(agentEntry) {
      if (!agentEntry) {
        return null;
      }

      // Backwards compatibility: old flat structure
      if (!agentEntry.agent) {
        const legacyCurrentMission =
          agentEntry.currentMission || agentEntry.mission || agentEntry.current_mission;

        return {
          ...agentEntry,
          currentMission: legacyCurrentMission,
        };
      }

      const agentData = agentEntry.agent || {};
      const shipData = agentData.ship || {};
      const currentMission = agentEntry.currentMission || null;

      return {
        id: agentData.id,
        icon: agentData.icon,
        name: agentData.name,
        rank: agentData.rank,
        originFactionId: agentData.originFactionId,
        originFactionName: agentData.originFactionName,
        originFactionNameShort: agentData.originFactionNameShort,
        negotiationLevel: agentData.negotiationLevel,
        espionageLevel: agentData.espionageLevel,
        shipId: shipData.id,
        shipName: shipData.name,
        shipPrestige: shipData.prestige,
        currentMission,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./scss/widget.scss";

.agents-widget {
  .list-group-item {
    background-color: transparent;
  }
}
</style>

