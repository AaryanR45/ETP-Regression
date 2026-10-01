import type { Locator, Page } from "@playwright/test";

const imageLoadTimeout = 20_000;
const defaultMaskSelectors = ["iframe", "video", "[data-visual-mask]"];

export async function stabilizeVisualPage(page: Page) {
  const denyButton = page.getByRole("button", { name: "Deny", exact: true });
  if (await denyButton.isVisible().catch(() => false)) {
    await denyButton.click({ timeout: 5_000 });
  }

  await page.evaluate(async () => {
    const pause = (duration: number) =>
      new Promise((resolve) => window.setTimeout(resolve, duration));
    const getPageHeight = () =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );

    document
      .querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
      .forEach((image) => {
        image.loading = "eager";
      });

    let position = 0;
    let stableBottomPasses = 0;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const heightBeforeScroll = getPageHeight();
      const maxScroll = Math.max(0, heightBeforeScroll - window.innerHeight);
      window.scrollTo(0, Math.min(position, maxScroll));
      await pause(200);

      const heightAfterScroll = getPageHeight();
      const atBottom =
        window.scrollY >= heightAfterScroll - window.innerHeight - 1;
      if (atBottom && heightAfterScroll === heightBeforeScroll) {
        stableBottomPasses += 1;
      } else {
        stableBottomPasses = 0;
      }
      if (stableBottomPasses >= 2) break;

      position = Math.min(
        window.scrollY + Math.max(1, Math.floor(window.innerHeight * 0.75)),
        heightAfterScroll,
      );
    }

    document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      image.loading = "eager";
    });
    window.scrollTo(0, getPageHeight());
    await pause(300);
    window.scrollTo(0, 0);

    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => window.setTimeout(resolve, 5_000)),
    ]);
    await new Promise((resolve) =>
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)),
    );
  });

  try {
    await page.waitForFunction(
      () =>
        Array.from(document.images).every((image) => {
          const hasSource =
            image.currentSrc ||
            image.getAttribute("src") ||
            image.getAttribute("srcset") ||
            image.closest("picture")?.querySelector("source[srcset]");
          return !hasSource || (image.complete && image.naturalWidth > 0);
        }),
      { timeout: imageLoadTimeout },
    );
  } catch (error) {
    const failedImages = await page.locator("img").evaluateAll((images) =>
      images.flatMap((element) => {
        const image = element as HTMLImageElement;
        const hasSource =
          image.currentSrc ||
          image.getAttribute("src") ||
          image.getAttribute("srcset") ||
          image.closest("picture")?.querySelector("source[srcset]");
        return hasSource && (!image.complete || image.naturalWidth === 0)
          ? [
              image.currentSrc ||
                image.src ||
                image.getAttribute("src") ||
                "(unknown source)",
            ]
          : [];
      }),
    );
    throw new Error(
      `Images did not load before the visual screenshot: ${failedImages.join(", ") || "unknown image state"}`,
      { cause: error },
    );
  }
}

export function getVisualMasks(
  page: Page,
  additionalSelectors: string[] = [],
): Locator[] {
  return [...new Set([...defaultMaskSelectors, ...additionalSelectors])].map(
    (selector) => page.locator(selector),
  );
}
