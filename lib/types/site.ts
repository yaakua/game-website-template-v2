export interface NavbarItem {
  title: string;
  href: string;
  visible?: boolean;
  children?: NavbarItem[];
}

export interface VideoItem {
  title: string;
  url: string;
}

// 评论
export interface CommentItem {
  author: string;
  role: string;
  avatar: string;
  content: string;
}

export interface FAQsItem {
  question: string;
  answer: string;
}

// 推荐游戏
export interface RecommendationItem {
  title: string;
  cover: string;
  url: string;
  category?: string;
  visible?: boolean;
  position?: string | number;
}

export interface FriendLinkItem {
  title: string;
  url: string;
}

export interface Theme {
  name?: string;
  headFont?: string | null;
  primaryColor?: string | null;
  fontColor?: string | null;
  backgroundColor?: string | null;
}

export interface MaterialItem {
  type: string;
  ratio: string;
  size: string;
  materialUrl: string;
  clickUrl: string;
  title: string;
}

export interface SiteConfig {
  // 网站名称
  name: string;
  // 网站标语
  slogan: string;
  // 网站域名
  domain: string
  pageName?: string;
  pagePath?: string;
  // 网站图标
  icon: string;
  // iframe || download || redirect
  gameType: string;
  // 苹果图标
  appleIcon: string;
  // 主题
  theme: Theme;
  // google 分析
  gaId: string;
  // clarity 分析
  clarityId: string;
  // 网站分析
  plausible: string;
  // 游戏 iframe url
  gameIframeUrl: string;
  // 游戏重定向地址
  gameRedirectUrl?: string;
  bgType: string;
  bgImage?: string;
  bgVideo?: string;
  // 游戏下载配置
  gameDownload?: {
    showDownloadButton: boolean;
    downloadUrls: {
      ios: string;
      android: string;
      pc: string;
      steam: string;
      mac: string;
    };
  };
  // 常见问题
  isShowFAQs: boolean;
  //
  isShowVideo: boolean;
  videos: VideoItem[];
  isShowComments: boolean;
  isShowTweets: boolean;
  // id
  tweets: string[];
  // 使用真实推特
  useRealTweets: boolean | null;
  comments: CommentItem[];
  isShowRecommendation: boolean;
  // 右侧游戏推荐
  isShowRightGames?: boolean;
  friendLinks: FriendLinkItem[];
  adsenseClientId?: string | null;
  // logo地址
  logoUrl?: string | null;
  // 开启广告
  enablePromotion?: boolean;
  // 推广素材
  selectedMaterial?: MaterialItem;
  // ads.txt 内容
  adsTxtContent?: string | null;
  // 是否自定义特色内容
  customizeFeatures?: boolean;
  // 游戏截图
  screenshotUrl?: string | null;
  // 创建时间
  createdTime?: string | null;
  // 更新时间
  updatedTime?: string | null;
  // 标签
  categories?:string[]
  // 模板类型
  templateType?:string
  // 自定义head内容
  customHeadContent?:string
}

export interface GameCategory {
  name: string;
  path: string;
  pageSize: number;
  backgroundColor?: string;
  displayStyle: 'horizontal'|'vertical';
  icon?: string;
  description?: string;
  games?: RecommendationItem[]
}

export interface GameBoxSettings{
  recommended: RecommendationItem[]
  categories: GameCategory[]
  allGames: RecommendationItem[]
} 