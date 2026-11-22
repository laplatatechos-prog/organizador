// Service worker del Organizador: muestra los avisos y abre la app al tocarlos.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "Organizador", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Organizador", {
    body: d.body || "",
    icon: "icono-192.png",
    badge: "icono-192.png",
    tag: d.tag || "org",
    data: { url: d.url || "./" },
    vibrate: [120, 60, 120]
  }));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ("focus" in cs[i]) { cs[i].postMessage({ tipo: "aviso" }); return cs[i].focus(); } }
    return self.clients.openWindow(url + (url.indexOf("?") < 0 ? "?" : "&") + "desde=aviso");
  }));
});
