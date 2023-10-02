import { useLoaderData } from "react-router-dom";
import RefsTable from "../components/RefsTable";

function CreationPage() {
  const loaderData = useLoaderData();

  return (
    <div>
      <RefsTable refsList={loaderData} />
    </div>
  );
}

export default CreationPage;

export async function loader({ params }) {
  const refsId = params.refsPageId;

  const response = await fetch("https://localhost:7189/api/Ref/" + refsId, {
    method: "GET",
  });

  const resData = await response.json();
  return resData;
}

export async function action({ request, params }) {
  const refsId = params.refsPageId;
  const formData = await request.formData();

  if (request.method === "POST") {
    const response = await fetch("https://localhost:7189/api/Ref/" + refsId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: formData.get("text"),
        url: formData.get("url"),
        type: formData.get("type"),
        order: formData.get("order"),
      }),
    });
    const resData = response.json();
    return resData;
  } else if (request.method === "DELETE") {
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + formData.get("refId"),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const resData = response.json();
    return resData;
  } else if (request.method === "PUT") {
    const response = await fetch(
      "https://localhost:7189/api/Ref/" + formData.get("refId"),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.get("refId"),
          type: formData.get("Type"),
          url: formData.get("url"),
          text: formData.get("text"),
          order: formData.get("order"),
        }),
      }
    );
    return null;
  }
}
