---
layout: page # Use the standard 'page' layout from the theme
title: Blog
permalink: /blog/ # The URL for this page will be yoursite.com/blog/
---

<section id="blog-index">
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h2>Blog Posts</h2>
        <hr class="star-primary"> {# Use a separator like other sections #}
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 col-lg-offset-2">
        <ul class="list-unstyled post-list">
          {% for post in site.posts %}
            <li>
              <h3>
                <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
              </h3>
              <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
              <p>
                {{ post.excerpt | strip_html | truncatewords: 50 }} {# Show an excerpt #}
                <a href="{{ post.url | prepend: site.baseurl }}">Read More &raquo;</a>
              </p>
            </li>
            {% unless forloop.last %}<hr>{% endunless %} {# Separator between posts #}
          {% endfor %}
        </ul>
        <!-- Optional: Add pagination if you have many posts -->
      </div>
    </div>
  </div>
</section>