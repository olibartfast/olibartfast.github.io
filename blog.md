---
layout: page # Use the theme's standard page layout
title: Blog
permalink: /blog/
---

{# ------------------------------------------------------- #}
{# BLOG INDEX PAGE SECTION                               #}
{# ------------------------------------------------------- #}

{# Optional: Change 'success' below to another background class #}
{# like 'portfolio', or remove class attribute for white background. #}
<section id="blog-index" class="success">
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h2>Blog Posts</h2>
        {# Use "star-light" if using a colored background like 'success', #}
        {# use "star-primary" if the section background is white/light. #}
        <hr class="star-light">
      </div>
    </div>
    <div class="row">
      {# Adjust column width (e.g., col-lg-8 col-lg-offset-2) if needed #}
      <div class="col-lg-10 col-lg-offset-1">

        {# It's better to style this list using CSS rules for '.post-list' #}
        {# and '.post-list li' in your theme's CSS/SCSS file #}
        {# rather than using inline styles here. #}
        <ul class="list-unstyled post-list">

          {% for post in site.posts %}
            <li> {# Add CSS class here for styling, e.g., class="blog-list-item" #}
              <h3 style="margin-top: 0;"> {# Style h3 via CSS #}
                <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
              </h3>
              <p class="post-meta" style="color: #777; font-size: 0.9em; margin-bottom: 10px;"> {# Style .post-meta via CSS #}
                {{ post.date | date: "%B %-d, %Y" }}
              </p>
              <p> {# Style excerpt paragraph via CSS #}
                {{ post.excerpt | strip_html | truncatewords: 50 }} {# Generates excerpt #}
                <a href="{{ post.url | prepend: site.baseurl }}">Read More &raquo;</a>
              </p>
            </li>

            {# Add a separator line between posts, unless it's the last one #}
            {% unless forloop.last %}<hr style="margin: 30px 0;">{% endunless %}

          {% endfor %}
        </ul>
        {# Optional: Add pagination if you have many posts #}
      </div>
    </div>
  </div>
</section>