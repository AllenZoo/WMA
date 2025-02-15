import { Image } from "react-native";

interface IAvatarProps {
  /**
   * URL of the image to display
   */
  imageUrl: string;
  /**
   * Size of the avatar in pixels
   * @default 50
   */
  size?: number;
}
const Avatar = ({ imageUrl, size = 50 }: IAvatarProps) => {
  return (
    <Image
      src={imageUrl}
      alt="Avatar"
      style={{ height: size, width: size, borderRadius: size / 2 }}
    />
  );
};
export default Avatar;
