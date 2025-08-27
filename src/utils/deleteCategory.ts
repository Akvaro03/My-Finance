async function DeleteCategory(accountsId: number) {
  return await fetch("/api/categories/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ delete_id: accountsId }),
  });
}

export default DeleteCategory;