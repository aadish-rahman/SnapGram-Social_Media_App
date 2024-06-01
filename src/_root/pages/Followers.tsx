import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const Followers = () => {
  const { id } = useParams();
  const { data: userData, isFetching } = useGetUserById(id!);

  return <div>Followers</div>;
};

export default Followers;
