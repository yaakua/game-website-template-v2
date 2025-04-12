import { RecommendationItem } from '@/lib/types';
import React from 'react';
import GameCard from './GameCard';
import RecommendTopSlot from '@/lib/components/slot/recommend-top-slot';
import RecommendBottomSlot from '@/lib/components/slot/recommend-bottom-slot';
type GroupedGames = {
  [key: string]: RecommendationItem[];
};

export default async function GameRecommendationCard({ locale }: { locale: string }) {
  let games: RecommendationItem[] = [];
  try {
    try {
      games = (await import(`@/resources/recommendation/${locale}.json`)).default;
    } catch {
      games = (await import(`@/resources/recommendation/en.json`)).default;
    }
    if (!Array.isArray(games)) {
      console.error(`Invalid recommendation data for ${locale}: expected an array`);
      return null;
    }
  } catch {
    console.error('Failed to load recommendation games');
  }
  
  // 过滤掉不可见和底部位置的游戏
  games = games.filter(game => {
    return game?.visible !== false && game?.position !== 'bottom';
  });
  
  let groupedGames: GroupedGames = {};
  // 按分类对游戏进行分组
  groupedGames = games.reduce((acc: GroupedGames, game) => {
    // @ts-expect-error game.category might be undefined
    if (!acc[game.category]) {
      // @ts-expect-error initializing category array
      acc[game.category] = [];
    }
    // @ts-expect-error pushing game to category array
    acc[game.category].push(game);
    return acc;
  }, {});


  if(Object.keys(groupedGames).length === 0) {
    return null;
  }
  
  return (
    <div className="hidden lg:block w-full lg:w-80 -mt-2">
      <div className="bg-card/50 rounded-lg px-3">
        <RecommendTopSlot/>
        <div className="grid grid-cols-2 auto-rows-auto gap-2">
        <GameCard groupedGames={groupedGames} />
        </div>
        <RecommendBottomSlot/>
      </div>
    </div>
  );
}
