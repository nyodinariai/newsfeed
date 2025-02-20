import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/shadcn/components/ui/card"
import { Button } from "@/ui/shadcn/components/ui/button"
import { ExternalLink } from 'lucide-react'

interface NewsItemProps {
    id?: number;
    title: string;
    description: string | null;
    url: string;
    source: string | null;
    published_at: string;
    category: string | null;
}

export function NewsItem({ title, description, url, source, published_at, category }: NewsItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{source}</CardDescription>
        <CardDescription>{published_at}</CardDescription>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center">
            Read More
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default NewsItem