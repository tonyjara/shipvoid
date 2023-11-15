//Avatar placeholders
export const avatars = [
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623638/podcast-solutions/avatars/hqa76voqxhz7iolzzeo9.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/birkhahcepzom9i4u8n1.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/uibbhsvlb8lrjjafeuwl.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/l9wa3gpbw93rbhnyekmy.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/q9rjtdocxlbbnfbe0ahc.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/lxrk5zc2lgbqccq3ahpc.jpg",
];
export const randomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex] as string;
};
