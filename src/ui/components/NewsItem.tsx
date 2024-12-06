import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'

interface NewsItemProps {
    id?: number;
    title: string;
    description: string;
    url: string;
    source: string;
    published_at: string;
}

export function NewsItem({ title, description, url, source, published_at }: NewsItemProps) {
  return (
    <Card className="overflow-hidden" style={{ marginBottom: '12px' }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{source}</CardDescription>
        <CardDescription>{published_at}</CardDescription>
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