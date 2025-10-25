import React from "react";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
  InlineCitationQuote,
} from "@/components/ai-elements/inline-citation";

interface Citation {
  number: string;
  title: string;
  url: string;
  description?: string;
  quote?: string;
}

interface CitationListProps {
  citations: Citation[];
}

export const CitationList: React.FC<CitationListProps> = React.memo(({ citations }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3">
      <InlineCitation>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={citations.map(c => c.url)} />
          <InlineCitationCardBody>
            <InlineCitationCarousel>
              <InlineCitationCarouselHeader>
                <InlineCitationCarouselPrev />
                <InlineCitationCarouselNext />
                <InlineCitationCarouselIndex />
              </InlineCitationCarouselHeader>
              <InlineCitationCarouselContent>
                {citations.map((source, index) => (
                  <InlineCitationCarouselItem key={index}>
                    <InlineCitationSource
                      title={source.title}
                      url={source.url === source.title ? undefined : source.url}
                      description={source.description}
                    />
                    {source.quote && (
                      <InlineCitationQuote>
                        {source.quote}
                      </InlineCitationQuote>
                    )}
                  </InlineCitationCarouselItem>
                ))}
              </InlineCitationCarouselContent>
            </InlineCitationCarousel>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
    </div>
  );
});

CitationList.displayName = "CitationList";
