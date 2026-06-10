const GRAPH = "https://graph.facebook.com/v21.0";

type PublishInput = {
  igUserId: string;
  accessToken: string;
  slideUrls: string[];
  caption: string;
};

type GraphResponse = { id?: string; error?: { message: string } };

async function graphPost(
  path: string,
  params: Record<string, string>
): Promise<GraphResponse> {
  const body = new URLSearchParams(params);
  const res = await fetch(`${GRAPH}/${path}`, { method: "POST", body });
  return res.json();
}

async function waitContainerReady(
  containerId: string,
  accessToken: string
): Promise<boolean> {
  for (let i = 0; i < 10; i++) {
    const res = await fetch(
      `${GRAPH}/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data.status_code === "FINISHED") return true;
    if (data.status_code === "ERROR") return false;
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

/**
 * Publica um carrossel (ou imagem unica) no Instagram Business.
 * Retorna o ID do post publicado.
 */
export async function publishToInstagram({
  igUserId,
  accessToken,
  slideUrls,
  caption,
}: PublishInput): Promise<string> {
  if (slideUrls.length === 0) {
    throw new Error("Nenhum slide pra publicar");
  }

  let creationId: string;

  if (slideUrls.length === 1) {
    const container = await graphPost(`${igUserId}/media`, {
      image_url: slideUrls[0],
      caption,
      access_token: accessToken,
    });
    if (!container.id) {
      throw new Error(container.error?.message ?? "Falha ao criar a imagem");
    }
    creationId = container.id;
  } else {
    const childIds: string[] = [];
    for (const url of slideUrls) {
      const child = await graphPost(`${igUserId}/media`, {
        image_url: url,
        is_carousel_item: "true",
        access_token: accessToken,
      });
      if (!child.id) {
        throw new Error(
          child.error?.message ?? `Falha ao subir o slide ${childIds.length + 1}`
        );
      }
      childIds.push(child.id);
    }

    const container = await graphPost(`${igUserId}/media`, {
      media_type: "CAROUSEL",
      children: childIds.join(","),
      caption,
      access_token: accessToken,
    });
    if (!container.id) {
      throw new Error(container.error?.message ?? "Falha ao montar o carrossel");
    }
    creationId = container.id;
  }

  const ready = await waitContainerReady(creationId, accessToken);
  if (!ready) {
    throw new Error("O Instagram nao terminou de processar as imagens");
  }

  const published = await graphPost(`${igUserId}/media_publish`, {
    creation_id: creationId,
    access_token: accessToken,
  });
  if (!published.id) {
    throw new Error(published.error?.message ?? "Falha ao publicar");
  }

  return published.id;
}
