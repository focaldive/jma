export interface Author {
    name: string;
    role: string;
}

export interface NewsItem {
    id: number;
    title: {
        rendered: string;
    };
    rttpg_excerpt: string;
    category: string;
    rttpg_author: {
        display_name: string;
    }
    date: string;
    rttpg_featured_image_url: {
        landscape: {
            0: string;
        };
    };
    content: {
        rendered: string;
    }
}

export async function fetchPosts(page: number = 1, perPage: number = 10): Promise<NewsItem[]> {
    const response = await fetch(`https://jaffnamuslimuk.org/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }

    const data: NewsItem[] = await response.json();
    return data;
}

export async function fetchSinglePost(id: number): Promise<NewsItem> {
    const response = await fetch(`https://jaffnamuslimuk.org/wp-json/wp/v2/posts/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }

    const data: NewsItem = await response.json();
    return data;
}

