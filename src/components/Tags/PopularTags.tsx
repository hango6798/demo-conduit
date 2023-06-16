import { useAppSelector } from "store/hooks";
import "./style.scss";

interface Props {
  currentTag: string;
  handleTagClick: (tag: string) => void;
}

export const PopularTags = ({ currentTag, handleTagClick }: Props) => {
  const { tags } = useAppSelector((store) => store.tagsReducer);

  return (
    <div className="w-100 border p-0 rounded overflow-hidden">
      <p className="h5 p-2 bg-primary text-center text-white mb-0">
        # Popular Tags
      </p>
      {tags.map((tag: string, index: number) => {
        return (
          <div
            key={index}
            onClick={() => handleTagClick(tag)}
            className={`text-secondary tag-item p-2 px-3 border-0 border-bottom ${
              tag === currentTag ? "active" : null
            }`}
          >
            {tag}
          </div>
        );
      })}
    </div>
  );
};