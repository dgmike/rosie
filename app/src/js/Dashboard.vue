<template>
<div>
Dash
</div>
</template>

<script>
export default {
  created() {
    this.$store.state.page = {
      title: 'Dashboard',
    };
  },
}
</script>
