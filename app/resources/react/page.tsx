import { redirect } from "next/navigation";
import { CURRICULUM } from "@/lib/react-hub/curriculum";

export default function ReactHubPage() {
  redirect(`/resources/react/${CURRICULUM[0].slug}`);
}
