import { getTracking } from "@/lib/cms";

/**
 * Injects admin-configured analytics and custom scripts.
 * Verification meta tags and GTM/GA/Meta pixels are emitted verbatim from
 * Admin > Tracking. Nothing is hardcoded - empty fields emit nothing.
 */
export async function TrackingScripts() {
  const t = await getTracking();
  if (process.env.NODE_ENV !== "production") return null;

  const hasGtm = !!t.googleTagManager;
  const hasGa = !!t.googleAnalytics;
  const hasPixel = !!t.metaPixel;

  if (!hasGtm && !hasGa && !hasPixel && !t.headScripts && !t.bodyScripts && !t.footerScripts) {
    return null;
  }

  return (
    <>
      {hasGtm ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${t.googleTagManager}');`,
          }}
        />
      ) : null}
      {hasGa ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${t.googleAnalytics}');`,
          }}
        />
      ) : null}
      {hasGa ? <script async src={`https://www.googletagmanager.com/gtag/js?id=${t.googleAnalytics}`} /> : null}
      {hasPixel ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${t.metaPixel}');fbq('track','PageView');`,
          }}
        />
      ) : null}
      {t.footerScripts ? <script dangerouslySetInnerHTML={{ __html: t.footerScripts }} /> : null}
    </>
  );
}
