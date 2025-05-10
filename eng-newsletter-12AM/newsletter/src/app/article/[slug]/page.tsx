import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Share2, Bookmark, MessageSquare } from "lucide-react"

export default function ArticlePage({ params }: { params: { slug: string } }) {
    // In a real application, you would fetch the article data based on the slug
    const article = {
        title: "Global Summit Reaches Historic Climate Agreement",
        subtitle: "World leaders pledge to reduce carbon emissions by 50% by 2030",
        author: "Sarah Johnson",
        date: "May 6, 2025",
        readTime: "8 min read",
        category: "Politics",
        image: "/placeholder.svg?height=720&width=1280",
        content: `
      <p>World leaders have reached a landmark agreement at the Global Climate Summit, pledging to reduce carbon emissions by 50% by 2030. The agreement, which was signed by representatives from 195 countries, marks a significant step forward in the global fight against climate change.</p>
      
      <p>The summit, which took place over the course of two weeks, saw intense negotiations between developed and developing nations over how to share the burden of reducing emissions. The final agreement includes provisions for financial assistance to help developing countries transition to cleaner energy sources.</p>
      
      <h2>Key Points of the Agreement</h2>
      
      <p>The agreement includes several key provisions:</p>
      
      <ul>
        <li>A commitment to reduce global carbon emissions by 50% by 2030, compared to 2005 levels</li>
        <li>A pledge to achieve carbon neutrality by 2050</li>
        <li>The establishment of a $100 billion annual fund to help developing countries transition to clean energy</li>
        <li>A mechanism for monitoring and verifying emissions reductions</li>
        <li>Increased investment in renewable energy research and development</li>
      </ul>
      
      <p>"This is a historic moment," said UN Secretary-General Antonio Guterres. "For the first time, we have a truly global agreement that addresses the urgency of the climate crisis."</p>
      
      <h2>Reactions from Around the World</h2>
      
      <p>Reactions to the agreement have been largely positive, with environmental groups hailing it as a significant step forward. "This agreement gives us hope that we can still avoid the worst impacts of climate change," said Greenpeace International Executive Director Jennifer Morgan.</p>
      
      <p>However, some critics argue that the agreement does not go far enough. "While this is certainly progress, we need even more ambitious targets if we're going to limit global warming to 1.5 degrees Celsius," said climate scientist Dr. James Hansen.</p>
      
      <p>Business leaders have also weighed in on the agreement. "This provides the certainty that businesses need to invest in clean energy and sustainable practices," said Apple CEO Tim Cook.</p>
      
      <h2>Implementation Challenges</h2>
      
      <p>Despite the optimism surrounding the agreement, experts warn that implementation will be challenging. Countries will need to make significant changes to their energy systems, transportation networks, and industrial processes to meet the ambitious targets.</p>
      
      <p>"The hard work begins now," said EU Climate Commissioner Frans Timmermans. "We need to translate these commitments into concrete policies and actions."</p>
      
      <p>The agreement includes a mechanism for reviewing progress every five years, with countries expected to submit updated plans for emissions reductions.</p>
      
      <h2>What's Next</h2>
      
      <p>The next steps will involve countries developing detailed plans for how they will meet their emissions reduction targets. This will include policies to promote renewable energy, improve energy efficiency, reduce deforestation, and transform transportation systems.</p>
      
      <p>The first review of progress under the agreement will take place in 2030, at which point countries will be expected to demonstrate that they are on track to meet their commitments.</p>
      
      <p>"This agreement is not the end of the road, but rather the beginning of a new phase in our collective effort to address climate change," said U.S. Climate Envoy John Kerry. "The real test will be in the implementation."</p>
    `,
        tags: ["Climate Change", "Global Summit", "Environment", "Politics", "International Relations"],
        relatedArticles: [
            {
                title: "The Economic Impact of Climate Change Policies",
                image: "/placeholder.svg?height=400&width=600",
                category: "Business",
            },
            {
                title: "How Renewable Energy is Transforming Global Power Markets",
                image: "/placeholder.svg?height=400&width=600",
                category: "Technology",
            },
            {
                title: "Climate Activists React to Global Summit Agreement",
                image: "/placeholder.svg?height=400&width=600",
                category: "Politics",
            },
        ],
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <Link href="/eng-newsletter-12AM/newsletter/public" className="text-2xl font-bold">
                            DailyNews
                        </Link>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/eng-newsletter-12AM/newsletter/public" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="flex-1">
                <article className="container py-8">
                    <div className="mx-auto max-w-3xl">
                        <div className="mb-6">
                            <Badge className="mb-4">{article.category}</Badge>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl">{article.title}</h1>
                            <p className="text-xl text-muted-foreground mb-6">{article.subtitle}</p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                    <span className="font-medium text-sm">
                      {article.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                    </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{article.author}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{article.date}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                                                {article.readTime}
                      </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
                            <Image
                                src={article.image || "/placeholder.svg"}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

                        <div className="mt-8 pt-8 border-t">
                            <div className="flex flex-wrap gap-2 mb-8">
                                {article.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <Button variant="outline" className="gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    Show Comments
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="border-t pt-8">
                                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                                <div className="grid gap-6 md:grid-cols-3">
                                    {article.relatedArticles.map((related, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={related.image || "/placeholder.svg"}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                            <CardContent className="p-4">
                                                <Badge variant="secondary" className="mb-2">
                                                    {related.category}
                                                </Badge>
                                                <h3 className="font-medium line-clamp-2">{related.title}</h3>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <section className="bg-muted py-12">
                    <div className="container">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
                            <p className="max-w-[600px]">Get the latest news and updates delivered directly to your inbox.</p>
                            <div className="flex w-full max-w-md gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <Button>Subscribe</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t py-6">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} DailyNews. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                Terms
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                Privacy
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
