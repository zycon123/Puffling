# beta.104 concurrent boss claims

Two simultaneous claims for the same Boss Session must serialize on `boss-settle:<sessionId>` and the Boss Session row. Exactly one request may create the inventory increment and acquisition receipt. A later identical request may return the existing receipt as a duplicate, but must never increment inventory again. A conflicting receipt must roll back and return an error.
