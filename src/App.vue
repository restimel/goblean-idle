<template>
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div>
    <router-view/>
</template>

<style>
:root {
    --brand-primary: #42b983;
    --text-color: #2c3e50;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--text-color);
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: var(--text-color);
}

#nav a.router-link-exact-active {
    color: var(--brand-primary);
}
</style>
