import { getTranslations } from 'next-intl/server';

export default async function Features({pageName}:{pageName:string|null}) {
  const prefix = pageName ? pageName + '.' : '';
  const t = await getTranslations(`${prefix}HomeFeatures`);
  const screenshot_prefix = pageName ? '/games/' + pageName : '';
  const game_screenshot_path = `${screenshot_prefix}/game_screenshot.webp`;
  return (
    <>
      <h2 className="text-xl md:text-5xl font-bold text-left mb-4 md:mb-8 text-yellow-300 font-leckerli">{t('gameTitle')}</h2>

      <div className="flex flex-row mb-4 md:mb-8 items-center">
        <section className="flex-1 pr-4 md:pr-8">
          <h2 className="text-lg md:text-3xl font-semibold mb-2 md:mb-4 text-teal-300 font-leckerli">{t('whatIsTitle')}</h2>
          <p className="text-sm md:text-base text-gray-200">{t('whatIsDescription')}</p>
        </section>
        <div className="flex-shrink-0 w-1/3">
          <div className="bg-gray-800/50 rounded-2xl p-1">
            <div className="h-[150px] md:h-[250px] overflow-hidden rounded-xl">
              <img
                src={game_screenshot_path}
                alt="Game screenshot"
                className="w-full h-full object-cover object-top rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mb-4 md:mb-8">
        <h2 className="text-lg md:text-3xl font-semibold mb-2 md:mb-4 text-yellow-300 font-leckerli">{t('howToPlayTitle')}</h2>
        <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base text-gray-300">
          <li>{t('howToPlayStep1')}</li>
          <li>{t('howToPlayStep2')}</li>
          <li>{t('howToPlayStep3')}</li>
        </ul>
      </section>
      <section className="mb-4 md:mb-8">
        <h2 className="text-lg md:text-3xl font-semibold mb-2 md:mb-4 text-yellow-300 font-leckerli">
          {t('keyFeaturesTitle')}
        </h2>
        <ul className="grid grid-cols-2 gap-2 md:gap-4">
          {['feature1', 'feature2', 'feature3', 'feature4'].map((feature, index) => (
            <li key={index} className="bg-gray-800 p-2 md:p-4 rounded-lg">
              <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-green-400">{t(`${feature}Title`)}</h3>
              <p className="text-xs md:text-base text-gray-400">{t(`${feature}Description`)}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
