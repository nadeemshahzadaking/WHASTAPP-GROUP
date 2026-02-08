
import { Language, Translations, Category } from './types';

const CATEGORIES_KEYS: Category[] = [
  'Education', 'Jobs', 'Business', 'Islamic', 'Entertainment',
  'News', 'Sports', 'Tech', 'Health', 'Food',
  'Movies', 'Poetry', 'Shopping', 'Real Estate', 'Trading',
  'Freelancing', 'Programming', 'Gaming', 'Funny', 'Status',
  'Quotes', 'Fashion', 'Travel', 'Automobiles', 'Agriculture',
  'Science', 'History', 'Photography', 'Social Help', 'Other',
  'Videos', 'Girls', 'Hot', 'Pro', 'Max',
  'Online Earning', 'IT & Software', 'Web Development', 'Mobile Apps', 
  'AI & Technology', 'Students', 'Scholarships', 'Exams & Preparation', 
  'Government Jobs', 'Private Jobs', 'Overseas Jobs', 'Visa & Immigration', 
  'Quran & Hadith', 'Islamic Education', 'Islamic Lectures', 'Dawah', 
  'Women Only', 'Ladies Groups', 'Marriage & Rishta', 'Family', 'Parenting', 
  'Fitness', 'Gym', 'Yoga', 'Medical', 'Doctors', 'Nurses', 
  'Dramas', 'Music', 'Cricket', 'Football', 'PUBG', 'Free Fire', 
  'E-commerce', 'Amazon', 'Daraz', 'Forex', 'Crypto', 'Property', 
  'Cars', 'Bikes', 'Tourism', 'Recipes', 'Local Community', 'City Groups', 
  'Breaking News', 'Memes', 'Study Abroad', 'IELTS', 'PTE', 
  'Freelance Marketplace', 'Fiverr', 'Upwork', 'Graphic Design', 'Video Editing',
  'Cyber Security', 'Digital Marketing', 'SEO Services', 'Stock Market',
  'Poetry & Ghazals', 'Motivational', 'Art & Craft', 'Pets & Animals'
];

const categoriesEN: any = {};
CATEGORIES_KEYS.forEach(k => categoriesEN[k] = k);

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    title: 'WhatsApp Directory',
    subtitle: 'Find and join high quality WhatsApp groups globally.',
    searchPlaceholder: 'Search name, category...',
    searchBtn: 'Search',
    addBtn: 'Add Group',
    viewGroupsBtn: 'Browse',
    homeLink: 'Home',
    viewLink: 'Groups',
    addLink: 'Submit',
    promoLink: 'Promote',
    aboutLink: 'About Us',
    officialLink: 'Official Links',
    backBtn: 'Back',
    clicksLabel: 'Views',
    // Fix: Removed duplicate 'allCategories' property from this line as it is defined again on line 103
    linkError: 'Invalid WhatsApp link',
    safetyTitle: 'Notice',
    safetyMessage: 'Your content is being processed.',
    closeBtn: 'Close',
    voicePrompt: 'English Version',
    promoPageTitle: 'Promote Your Business',
    promoPageSub: 'Get thousands of eyes on your WhatsApp group or service.',
    promoContactHeader: 'Contact for Advertisement',
    promoInstructions: 'To feature your group at the top or place custom banners, please send an email with your details.',
    promoEmailLabel: 'Contact Email',
    promoTemplateLabel: 'Email Format Example',
    promoTemplateContent: 'Subject: Promotion Request\n\nGroup Name: [Name]\nGroup Link: [Link]\nDuration: [1 Week/1 Month]',
    aboutTitle: 'About Us',
    aboutContent: 'Welcome to the world\'s largest professional WhatsApp group directory. We provide a platform to find active communities across 100+ categories. Our mission is to connect people safely and efficiently.',
    officialTitle: 'Official Channels',
    officialSub: 'Connect with our official social media handles and support.',
    categories: categoriesEN,
    allCategories: 'All Categories',
    groupsListTitle: 'Explore Groups',
    groupsFound: 'groups found',
    noGroups: 'No Groups Found',
    noGroupsSub: 'Try changing your search or category filters.',
    joinNow: 'Join Group',
    addNewGroup: 'Add Your Group',
    groupName: 'Group Name',
    groupLink: 'WhatsApp Link',
    selectCategory: 'Select Category',
    descriptionLabel: 'Group Description',
    submitBtn: 'Submit Group',
    successTitle: 'Success!',
    successMsg: 'Your group has been submitted for review.',
    footerLine1: '© 2024 WhatsApp Directory. Professional & Secure.',
    footerLine2: 'This site is not affiliated with WhatsApp Inc.',
    dir: 'ltr'
  }
};