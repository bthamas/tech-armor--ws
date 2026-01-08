export const router = {
    navigate: (path, p) => {
        window.location.hash = p ? `${path}/${p}` : path;
        // renderView is expected to be global or we need to dispatch an event
        if (window.renderView) window.renderView(true);
    }
};

window.router = router;
