import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profilesApi from "api/profilesApi";
import { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { setCurrentArticle } from "store/articlesSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setShowPopup, Popup } from "store/userSlice";

interface Props {
  following: boolean;
  username: string;
  variant?: string;
  size?: "sm" | "lg";
  className?: string;
}

export const FollowButton = ({
  following,
  username,
  variant: v,
  size,
  className,
}: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.userReducer);
  const [loading, setLoading] = useState<boolean>(false);
  const [follow, setFollow] = useState<boolean>(following);
  const { currentArticle } = useAppSelector((store) => store.articlesReducer);

  const variant = useMemo(() => {
    if (v) {
      return follow ? v : `outline-${v}`;
    }
    return follow ? "light" : "outline-light";
  }, [v, follow]);

  const handleClick = () => {
    if (!user.username) {
      dispatch(
        setShowPopup({
          name: Popup.LOGIN,
          open: true,
        })
      );
    }
    setLoading(true);
    setFollow(!follow);
    const api = follow ? profilesApi.unfollow : profilesApi.follow;

    api(username)
      .then((r) => {
        setFollow(r.data.profile.following);
        console.log(currentArticle);
        dispatch(
          setCurrentArticle({
            ...currentArticle,
            author: {
              ...currentArticle.author,
              following: r.data.profile.following,
            },
          })
        );
      })
      .catch((error) => {
        console.log(error);
        setFollow(!follow);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setFollow(following);
  }, [following]);

  return (
    <Button
      variant={variant}
      className={className || ""}
      onClick={handleClick}
      disabled={loading}
      size={size || undefined}
      style={{ fontWeight: "600" }}
    >
      <FontAwesomeIcon icon={follow ? faMinus : faPlus} className="me-2" />
      {follow ? "Unfollow" : "Follow"}
    </Button>
  );
};
