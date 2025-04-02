---
layout: page # Use the standard 'page' layout from the theme
title: Blog
permalink: /blog/
---

<section id="blog-index" class="success"> {# Optional: Change 'success' or remove for white background #}
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h2>Blog Posts</h2>
        <hr class="star-light"> {# Use star-primary if not on colored background #}
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 col-lg-offset-2"> {# Adjust column width if needed #}
        <ul class="list-unstyled post-list">
          {% for post in site.posts %}
            <li> {# Add styling via CSS classes for this li if desired #}
              <h3>
                <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
              </h3>
              <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
              <p>
                {{ post.excerpt | strip_html | truncatewords: 50 }}
                <a href="{{ post.url | prepend: site.baseurl }}">Read More &raquo;</a>
              </p>
            </li>
            {% unless forloop.last %}<hr>{% endunless %}
          {% endfor %}
        </ul>
      </div>
    </div>
  </div>
</section>
