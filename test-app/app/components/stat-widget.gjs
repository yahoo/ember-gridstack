<template>
  <div class="widget">
    <div class="widget-label">{{@label}}</div>
    <div class="stat-value">{{@value}}</div>
    {{#if @delta}}
      <div
        class="stat-delta {{if @negative 'is-down' 'is-up'}}"
      >{{@delta}}</div>
    {{/if}}
    {{yield}}
  </div>
</template>
