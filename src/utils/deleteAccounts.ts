async function DeleteAccounts(accountsId: number) {
  return await fetch("/api/account/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ delete_id: accountsId }),
  });
}

export default DeleteAccounts;
