import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'

interface NewsItemProps {
  title: string
  description: string
  url: string
  source: string
  imageUrl?: string
}

export function NewsItem({ title, description, url, source, imageUrl }: NewsItemProps) {
  return (
    <Card className="overflow-hidden" style={{ marginBottom: '12px' }}>
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{source}</CardDescription>
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