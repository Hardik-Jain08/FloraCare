export const getGreenhouseJobIdFromCurrentLocation = () => {
  const inUrl = /\/careers\/jobs\/(\d+)/.exec(window.location.href);
  if (inUrl && inUrl[1]) return inUrl[1];
  const inQuery = /\?gh_jid=(\d+)/.exec(window.location.search);
  return inQuery ? inQuery[1] : null;
};
