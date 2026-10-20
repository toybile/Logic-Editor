// Shared visual chrome only: callers retain their original close handlers and state.
const LPDialogChrome = {
  close(button) {
    button.classList.add('hy-dialog-close');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
    return button;
  },
};
