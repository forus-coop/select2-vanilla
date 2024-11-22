define([
  '../utils'
], function (Utils) {
  function InfiniteScroll (decorated, element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, element, options, dataAdapter);

    this.loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.results.append(this.loadingMore);
      this.loadMoreIfNeeded();
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, element) {
    var self = this;

    decorated.call(this, container, element);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.results.addEventListener('scroll', this.loadMoreIfNeeded.bind(this));
  };

  InfiniteScroll.prototype.loadMoreIfNeeded = function () {
    var isLoadMoreVisible = document.documentElement.contains(this.loadingMore);

    if (this.loading || !isLoadMoreVisible) {
      return;
    }

    var currentOffset = this.results.getBoundingClientRect().top +
      this.results.offsetHeight;
    var loadingMoreOffset = this.loadingMore.getBoundingClientRect().top +
      this.loadingMore.offsetHeight;

    if (currentOffset + 50 >= loadingMoreOffset) {
      this.loadMore();
    }
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = Object.assign({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var option = document.createElement('li');
    option.className = 'select2-results__option select2-results__option--load-more';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-disabled', 'true');

    var message = this.options.get('translations').get('loadingMore');

    option.innerHTML = message(this.lastParams);

    return option;
  };

  return InfiniteScroll;
});
